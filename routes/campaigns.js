const express = require('express');
const clerk = require
const router = express.Router();
const Campaigns = require('../models/Campaigns');
const { clerkClient } = require('@clerk/express');

router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaigns.findAll();
    true
    const plaincampaigns = campaigns.map((campaign) =>
      campaign.get({ plain: true })
    );

    res.render('campaigns', {
        title: 'Campaigns',
        description: 'List of campaigns.',
        campaigns: plaincampaigns
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).send('Server Error');
  }
});

// Deprecated route.
/*
router.get('/new', (req, res) => {
  res.render('campaigns_new', {
    title: 'Create New Campaign',
    description: 'Campaigns comprise a series of tests.'
  });
});*/

router.post('/create', async (req, res) => {
  const name = req.body.name;
  const notes = req.body.notes;
  const { userId } = req.auth; 
  // console.log(req.body);
  try {
    const campaign = await Campaigns.create({name, notes, owner: userId});
    res.redirect(`/campaigns/manage/${campaign.id}`);
  } catch (error) {
    console.error('Error saving campaign:', error);
    res.status(500).send('Server Error');
  }
});

router.post('/delete/:id', async (req, res) => {
  const campaignId = req.params.id;

  try {
    const campaign = await Campaigns.findByPk(campaignId);

    if (!campaign) {
      return res.status(404).send('Campaign not found');
    }

    await campaign.destroy();

    res.redirect('/campaigns');
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).send('Server Error');
  }
});

router.get('/manage/:id', async (req, res) => {
  const campaignId = req.params.id;
  try {
    const campaign = await Campaigns.findByPk(campaignId);
    user = await clerkClient.users.getUser(campaign.owner)

    if (!campaign) {
      return res.status(404).send('Campaign not found.');
    }

    res.render('campaign_manage', {
      title: 'Campaign Manager',
      description: 'Here, you can manage your campaign. Import users, create tests, set schedules, etc.',
      campaign: campaign.get({plain: true}),
      user
    });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).send('Server Error')
  }
});
module.exports = router;
