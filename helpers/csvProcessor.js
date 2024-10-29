const fs = require('fs');
const csv = require('csv-parser');
const Targets = require('../models/Targets');

function processCsvFile(csvFilePath, callback) {
  const users = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      console.log('Parsed Row:', row);

      const newUser = {
        FirstName: row['FirstName'], 
        LastName: row['LastName'],
        EmailAddress: row['EmailAddress'],
        JobTitle: row['JobTitle'],
        Supervisor: row['Supervisor'],
        Department: row['Department'],
      };
      
      if (
        newUser.FirstName &&
        newUser.LastName &&
        newUser.EmailAddress &&
        newUser.JobTitle &&
        newUser.Supervisor &&
        newUser.Department
      ) {
        users.push(newUser);
      } else {
        console.log('Invalid data row skipped:', newUser);
      }
    })
    .on('end', async () => {
      try {
        console.log('Parsed CSV data:', users);

        if (users.length > 0) {
          await Targets.bulkCreate(users);
          console.log('Users successfully inserted into the database.');
          callback(null);
        } else {
          console.error('No valid data to insert into the database.');
          callback(new Error('No valid data found in the CSV.'));
        }
      } catch (error) {
        console.error('Error inserting CSV data into database:', error);
        callback(error);
      } finally {
        fs.unlink(csvFilePath, (err) => {
          if (err) {
            console.error('Error deleting temp CSV file:', err);
          }
        });
      }
    })
    .on('error', (err) => {
      console.error('Error reading CSV file:', err);
      callback(err);
    });
}

module.exports = {
  processCsvFile,
};