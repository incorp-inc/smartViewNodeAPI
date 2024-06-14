const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const moment = require('moment');
const { parse } = require('csv-parse');

module.exports.getUserActivity = (username, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    const directoryPath = 'C:/UserLogs';
    const fileName = `${username}.csv`;
    const filePath = path.join(directoryPath, fileName);

    const results = [];
    const start = moment(startDate, 'YYYY-MM-DD');
    const end = moment(endDate, 'YYYY-MM-DD').endOf('day'); // Ensure the end date includes the whole day

    console.log(start.toString(), end.toString());

    if (!fs.existsSync(filePath)) {
      console.error(`File for user ${username} not found.`);
      reject(new Error(`File for user ${username} not found.`));
      return;
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const rowDate = moment(row.Timestamp, 'DD/MM/YYYY h:mm:ss A');
        if (rowDate.isBetween(start, end, null, '[]')) {
          results.push(row);
        }
      })
      .on('end', () => {
        console.log(results);
        resolve(results);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

module.exports.getAllUserData = (username) => {
    return new Promise((resolve, reject) => {
      const directoryPath = 'C:/UserLogs';
      const fileName = `${username}.csv`;
      const filePath = path.join(directoryPath, fileName);
  
      const userData = [];
  
      if (!fs.existsSync(filePath)) {
        console.error(`File for user ${username} not found.`);
        reject(new Error(`File for user ${username} not found.`));
        return;
      }
  
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          userData.push(row);
        })
        .on('end', () => {
          resolve(userData);
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  };


  module.exports.getCountOfFilesMatchingCriteria = (startDate, endDate, menu, subMenu) => {
    return new Promise((resolve, reject) => {
      const directoryPath = 'C:/UserLogs';
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          console.error(`Error reading directory ${directoryPath}:`, err);
          reject(err);
          return;
        }
  
        const csvFiles = files.filter(file => path.extname(file) === '.csv');
  
        if (csvFiles.length === 0) {
          console.log(`No CSV files found in directory ${directoryPath}.`);
          resolve({ count: 0, userNames: [] });
          return;
        }
  
        const usernameCounts = {};
  
        const start = moment.utc(startDate, 'YYYY-MM-DD');
        const end = moment.utc(endDate, 'YYYY-MM-DD').endOf('day'); // Ensure the end date includes the whole day
  
        let processedFiles = 0;
  
        csvFiles.forEach((file) => {
          const filePath = path.join(directoryPath, file);
          const username = path.basename(file, '.csv'); // Extract username from filename
  
          fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
              const rowDate = moment.utc(row.Timestamp, 'DD/MM/YYYY h:mm:ss A');
              if (
                rowDate.isValid() &&
                rowDate.isBetween(start, end, null, '[]') &&
                row.Menu === menu &&
                row.Submenu === subMenu
              ) {
                console.log('Matching record:', row);
                usernameCounts[username] = (usernameCounts[username] || 0) + 1;
              }
            })
            .on('end', () => {
              processedFiles++;
              if (processedFiles === csvFiles.length) {
                const filteredUsernames = Object.keys(usernameCounts).filter(username => usernameCounts[username] > 1);
                resolve({ count: filteredUsernames.length, userNames: filteredUsernames });
              }
            })
            .on('error', (err) => {
              reject(err);
            });
        });
      });
    });
  };


module.exports.getUniqueMenuAndSubmenu = () => {
  return new Promise((resolve, reject) => {
    const directoryPath = 'C:/UserLogs';
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.error(`Error reading directory ${directoryPath}:`, err);
        reject(err);
        return;
      }

      const csvFiles = files.filter(file => path.extname(file) === '.csv');

      if (csvFiles.length === 0) {
        console.log(`No CSV files found in directory ${directoryPath}.`);
        resolve({ menus: [], submenus: [] });
        return;
      }

      const uniqueMenus = new Set();
      const uniqueSubmenus = new Set();

      let processedFiles = 0;

      csvFiles.forEach((file) => {
        const filePath = path.join(directoryPath, file);

        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (row) => {
            uniqueMenus.add(row.Menu);
            uniqueSubmenus.add(row.Submenu);
          })
          .on('end', () => {
            processedFiles++;
            if (processedFiles === csvFiles.length) {
              const menus = Array.from(uniqueMenus);
              const submenus = Array.from(uniqueSubmenus);
              resolve({ menus, submenus });
            }
          })
          .on('error', (err) => {
            reject(err);
          });
      });
    });
  });
};
