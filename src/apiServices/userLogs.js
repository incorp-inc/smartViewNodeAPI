const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const moment = require('moment');
const { parse } = require('csv-parse');
const { stringify } = require('csv-stringify');


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

module.exports.getCountOfFilesMatchingCriteria = (startDate, endDate, menu) => {
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

            const usernameCounts = new Set();

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
                            row.Menu === menu
                        ) {
                            usernameCounts.add(username); // Add user to set if criteria match
                        }
                    })
                    .on('end', () => {
                        processedFiles++;
                        if (processedFiles === csvFiles.length) {
                            resolve({ count: usernameCounts.size, userNames: Array.from(usernameCounts) });
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

module.exports.getMenuAccessCount = (startDate, endDate) => {
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
                resolve({});
                return;
            }

            const menuAccessCount = {};
            const uniqueUserMenus = {};
            const allMenus = new Set();

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
                        if (rowDate.isValid()) {
                            allMenus.add(row.Menu); // Collect all unique menus
                            if (rowDate.isBetween(start, end, null, '[]')) {
                                if (!uniqueUserMenus[username]) {
                                    uniqueUserMenus[username] = new Set();
                                }
                                uniqueUserMenus[username].add(row.Menu);
                            }
                        }
                    })
                    .on('end', () => {
                        processedFiles++;
                        if (processedFiles === csvFiles.length) {
                            // Initialize menuAccessCount with all menus set to 0
                            allMenus.forEach(menu => {
                                menuAccessCount[menu] = 0;
                            });

                            // Count the unique users who accessed each menu
                            Object.keys(uniqueUserMenus).forEach((username) => {
                                uniqueUserMenus[username].forEach((menu) => {
                                    menuAccessCount[menu] += 1;
                                });
                            });
                            resolve(menuAccessCount);
                        }
                    })
                    .on('error', (err) => {
                        reject(err);
                    });
            });
        });
    });
};



const menuItems = [
    "DashBoard",
    "Corporate Secretary",
    "Accounting Module",
    "InCorp Tickets",
    "Knowledge Base"
];

module.exports.getMenuAccessCountByMonth = (month, year) => {
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
                resolve([]);
                return;
            }

            const daysInMonth = moment(`${year}-${month}`, 'YYYY-MM').daysInMonth();
            const menuAccessCountByDay = Array.from({ length: daysInMonth }, (_, i) => ({
                day: i + 1,
                counts: menuItems.reduce((acc, menu) => {
                    acc[menu] = new Set(); // Use a set to store unique users
                    return acc;
                }, {})
            }));

            let processedFiles = 0;

            csvFiles.forEach((file) => {
                const filePath = path.join(directoryPath, file);

                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (row) => {
                        const rowDate = moment(row.Timestamp, 'DD/MM/YYYY h:mm:ss A');
                        if (rowDate.isValid() && rowDate.year() === parseInt(year) && rowDate.month() === parseInt(month) - 1) {
                            const day = rowDate.date();
                            const menu = row.Menu;
                            const user = row.UserName;

                            if (menuItems.includes(menu)) {
                                menuAccessCountByDay[day - 1].counts[menu].add(user); // Add the user to the set
                            }
                        }
                    })
                    .on('end', () => {
                        processedFiles++;
                        if (processedFiles === csvFiles.length) {
                            // Convert sets to counts
                            const result = menuAccessCountByDay.map(day => {
                                const counts = {};
                                for (const menu in day.counts) {
                                    counts[menu] = day.counts[menu].size;
                                }
                                return { day: day.day, counts };
                            });
                            resolve(result);
                        }
                    })
                    .on('error', (err) => {
                        reject(err);
                    });
            });
        });
    });
};



module.exports.getAllDataWithinDateRange = (startDate, endDate, outputFilePath) => {
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
                resolve();
                return;
            }

            const start = moment.utc(startDate, 'YYYY-MM-DD');
            const end = moment.utc(endDate, 'YYYY-MM-DD').endOf('day'); // Ensure the end date includes the whole day

            let processedFiles = 0;
            const results = [];

            csvFiles.forEach((file) => {
                const filePath = path.join(directoryPath, file);

                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (row) => {
                        const rowDate = moment.utc(row.Timestamp, 'DD/MM/YYYY h:mm:ss A');
                        if (!rowDate.isValid()) {
                            console.error(`Invalid date format in row: ${JSON.stringify(row)}`);
                            return;
                        }
                        if (rowDate.isBetween(start, end, null, '[]')) {
                            results.push(row);
                        }
                    })
                    .on('end', () => {
                        processedFiles++;
                        if (processedFiles === csvFiles.length) {
                            // Write the results to a new CSV file
                            stringify(results, { header: true }, (err, output) => {
                                if (err) {
                                    console.error('Error writing CSV string:', err);
                                    reject(err);
                                    return;
                                }
                                fs.writeFile(outputFilePath, output, (err) => {
                                    if (err) {
                                        console.error('Error writing to file:', err);
                                        reject(err);
                                        return;
                                    }
                                    resolve();
                                });
                            });
                        }
                    })
                    .on('error', (err) => {
                        console.error(`Error processing file ${filePath}:`, err);
                        reject(err);
                    });
            });
        });
    });
};