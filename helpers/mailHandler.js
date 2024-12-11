const { EmailAddress } = require('@clerk/express');
const logHelper = require('../helpers/logHelper');
const { Targets } = require('../models')
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

const massMailer = async (from, to, subject, text, html) => {
  const currentDateTime = logHelper.getFormattedDateTime();

  const currentTarget = await Targets.findOne({
    where: {
    EmailAddress: to,
    }
  });
  const plainTarget = currentTarget.get({ plain: true });

  const modPrefix = to.split('@')[0];
  const modEmail = `csw.code+${modPrefix}@gmail.com`;
  mg.messages
    .create('mediocresolutions.org', {
      from: from,
      to: modEmail,
      subject: subject,
      text: text,
      html: html
    })
    .then((msg) => {
      console.log(msg);

      const statusCode = 200;
      const logEntry = `${currentDateTime} ${statusCode} Admin <${from}> ${plainTarget.FirstName} ${plainTarget.LastName} <${to}>\n`;

      fs.writeFile('./logs/email.log', logEntry, { flag: 'a' }, function (err) {
        logHelper.handleError(err);
        console.log("Success");
        // res.status(statusCode).json({ message: 'Email sent successfully' });
      });
    })
    .catch((err) => {
      console.error('Error sending email:', err);
      statusCode = 500;

      fs.writeFile('./logs/email.log', logEntry, { flag: 'a' }, function (err) {
        logHelper.handleError(err);
        // res.status(statusCode).json({ error: 'Failed to send email' });
        console.log("Failed");
      });
    });
};

module.exports = {
  sendMail,
  massMailer
};
