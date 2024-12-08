const { Op } = require('sequelize');
const express = require('express');
const router = express.Router();
const { EmailTemplate, Targets, Lists, Tests, TestTargets, Campaigns } = require('../models')
const mailHandler = require('../helpers/mailHandler');
const { clerkClient } = require('@clerk/express');

const isToday = (arbitraryDate) => {
  const today = new Date();
  const targetDate = new Date(arbitraryDate);

  return (
    today.getFullYear() === targetDate.getFullYear() &&
    today.getMonth() === targetDate.getMonth() &&
    today.getDate() === targetDate.getDate()
  );
};

const isDaysSince = (arbitraryDate, days) => {
  const currentDate = new Date();
  const targetDate = new Date(arbitraryDate);

  const differenceInTime = currentDate.getTime() - targetDate.getTime();
  const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));

  return differenceInDays === days;
};

router.post('/send-email', (req, res) => {
  mailHandler.sendMail(req, res);
});

router.get('/mail', async (req, res) => { 
  // Date/time requirements
  const currentDatetime = new Date();
  res.json({ datetime: currentDatetime.toISOString() });

  const arbitraryDate = '2024-11-27T00:00:00Z';
  const period = 7;

  const oneWeekAgo = (isDaysSince(arbitraryDate, 7) && period === 7);
  const twoWeeksAgo = (isDaysSince(arbitraryDate, 14) && period === 14);
  const oneMonthAgo = (isDaysSince(arbitraryDate, 30) && period === 30);

  console.log('1 week ago:', oneWeekAgo);
  console.log('2 weeks ago:', twoWeeksAgo);
  console.log('1 month ago:', oneMonthAgo);

  const meetsTimeRequirement = (isToday || oneWeekAgo || twoWeeksAgo || oneMonthAgo);

  if (meetsTimeRequirement) {
    //console.log("Time requirement met!")
  }

  const tests = await Tests.findAll({
    raw: true
  });

  console.log(tests);

});

module.exports = router;