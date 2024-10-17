const logHelper = require('../helpers/logHelper');
const formData = require('form-data');
const fs = require('fs');

require('dotenv').config();

const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_SENDING_KEY
});

const sendMail = (req, res) => {
  const { to, subject, text, html } = req.body;
  const from = 'Admin <admin@mediocresolutions.org>';
  const currentDateTime = logHelper.getFormattedDateTime();

  mg.messages
    .create('mediocresolutions.org', {
      from: from,
      to: [to],
      subject: subject,
      text: text,
      html: html
    })
    .then((msg) => {
      console.log(msg);

      const statusCode = 200;
      const logEntry = `${currentDateTime} ${statusCode} ${from} ${to}\n`;

      fs.writeFile('./logs/email.log', logEntry, { flag: 'a' }, function (err) {
        logHelper.handleError(err);
        res.status(statusCode).json({ message: 'Email sent successfully' });
      });
    })
    .catch((err) => {
      console.error('Error sending email:', err);
      statusCode = 500;

      fs.writeFile('./logs/email.log', logEntry, { flag: 'a' }, function (err) {
        logHelper.handleError(err);
        res.status(statusCode).json({ error: 'Failed to send email' });
      });
    });
};

module.exports = {
  sendMail
};
