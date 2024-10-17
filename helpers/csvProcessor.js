const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const numHelper = require('../helpers/randomNumber');

const usersJSON = path.join(__dirname, '..', 'data', 'users.json');

function processCsvFile(csvFilePath, callback) {
  const users = [];

  fs.readFile(usersJSON, 'utf-8', (err, jsonData) => {
    if (err) {
      console.error('Error reading users.json:', err);
      return callback(err);
    }

    let existingUsers;
    try {
      existingUsers = JSON.parse(jsonData);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return callback(parseError);
    }

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const newUser = {
          id: numHelper.generateRandomNumber(),
          ...row,
          dateAdded: new Date().toISOString()
        };
        users.push(newUser);
      })
      .on('end', () => {
        console.log('CSV file successfully processed');

        const updatedUsers = [...existingUsers, ...users];

        fs.writeFile(
          usersJSON,
          JSON.stringify(updatedUsers, null, 4),
          (err) => {
            if (err) {
              console.error('Error writing to users.json:', err);
              return callback(err);
            }

            console.log('users.json successfully updated with CSV data');
            callback(null); 

            fs.unlink(csvFilePath, (err) => {
              if (err) {
                console.error('Error deleting temp CSV file:', err);
              }
            });
          }
        );
      });
  });
}

module.exports = {
  processCsvFile
};
