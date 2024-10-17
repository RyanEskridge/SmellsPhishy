const express = require('express');
const router = express.Router();

const mailHandler = require('../helpers/mailHandler');

router.post('/send-email', (req, res) => {
  mailHandler.sendMail(req, res);
});

module.exports = router;
