const express = require('express');
const router = express.Router();
const { GlobalSettings } = require('../models');
const { clerkClient } = require('@clerk/express');


router.get('/', async (req, res) => {
  let plainSettings;
  const defaultSettings = {
    id: 1,
    CompanyName: 'Mediocre Solutions',
    ApiKey: '6a53edf24a8d7698710adc470115b90',
    CustomLink: 'https://www.youtube.com/watch?v&#x3D;o0btqyGWIQw'
  };
  
  try {
    const settings = await GlobalSettings.findByPk(1);
    if (!settings) { 
      plainSettings = defaultSettings; 
    } else {
      plainSettings = settings.get({ plain: true });
    }
  } catch (error) {
    console.error('Error fetching GlobalSettings:', error);
    plainSettings = defaultSettings;
  }
  

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