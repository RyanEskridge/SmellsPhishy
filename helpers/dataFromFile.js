const fs = require('fs');
const path = require('path');

const dataFromFile = (callback, filename) => {
  const filePath = path.join(__dirname, '..', 'data', filename);

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return callback(err, null);
    }

    let lists = [];

    try {
      lists = JSON.parse(data);
    } catch (jsonError) {
      console.error('Error parsing JSON data:', jsonError);
      return callback(jsonError, null);
    }

    callback(null, lists);
  });
};

module.exports = dataFromFile;
