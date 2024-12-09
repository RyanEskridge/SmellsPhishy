const express = require('express');
const router = express.Router();
const { GlobalSettings } = require('../models');
const { clerkClient } = require('@clerk/express');


router.get('/', async (req, res) => {
    const settings = await GlobalSettings.findByPk(1);
    const plainSettings = settings.get({ plain: true });
    res.render('settings', {
      title: 'Settings',
      description: 'Adjust your settings here.',
      settings: plainSettings
    });
  });

  router.put('/save', async (req, res) => {
    try {
        const [updated] = await GlobalSettings.update(req.body, {
          where: { id: 1 },
        });
        if (!updated) {
          return res.status(404).json({ message: 'Settings not found.' });
        }
        res.status(200).json({ message: 'Settings updated successfully.' });
      } catch (error) {
        res.status(500).json({ message: 'Failed to update settings.' });
      }
});

module.exports = router;