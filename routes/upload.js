const express = require('express');
const router = express.Router();

const multer = require('multer');
const { processCsvFile } = require('../helpers/csvProcessor');

const upload = multer({ dest: 'uploads/' }); 

router.post('/upload', upload.single('file'), (req, res) => {
  const csvFilePath = req.file.path; 

  processCsvFile(csvFilePath, (err) => {
    if (err) {
      return res.status(500).send('Error processing the CSV file');
    }

    res.redirect('/users');
  });
});

module.exports = router;
