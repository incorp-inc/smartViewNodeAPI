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

  