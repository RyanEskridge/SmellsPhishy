const express = require('express');
const router = express.Router();
const { Tests, Campaigns, TestTargets, Targets } = require('../models');
const { clerkClient } = require('@clerk/express');
const sequelize = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaigns.findAll();
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

router.post('/create', async (req, res) => {
  const name = req.body.name;
  const notes = req.body.notes;
  const { userId } = req.auth;
  // console.log(req.body);
  try {
    const campaign = await Campaigns.create({ name, notes, owner: userId });
    res.redirect(`/campaigns/manage/${campaign.id}`);
  } catch (error) {
    console.error('Error saving campaign:', error);
    res.status(500).send('Server Error');
  }
});

router.put('/:id', async (req, res) => {
  try {
    // Fetch the existing campaign
    const campaign = await Campaigns.findByPk(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    // Merge updated fields with existing fields
    const updatedData = {
      ...campaign.get(), 
      ...req.body,       
    };

    // Update the campaign
    await campaign.update(updatedData);

    res.status(200).json({ message: 'Campaign updated successfully.' });
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ message: 'Failed to update Campaign data.' });
  }
});

router.post('/delete/:id', async (req, res) => {
  const campaignId = req.params.id;

  try {
    const campaign = await Campaigns.findByPk(campaignId);

    const tests = await Tests.findAll({ where: { camp_id: campaignId } });
    
    if (!campaign) {
      return res.status(404).send('Campaign not found');
    }

    // Delete TestTargets
    const testIds = tests.map(test => test.id);
    await TestTargets.destroy({
        where: { testId: testIds },
    });

    // Delete Tests
    await Tests.destroy({
      where: { camp_id: campaignId },
    });

    // Delete Campaign
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
    const statusText = campaign.status ? 'Active' : 'Inactive';

    const tests = await Tests.findAll({
      raw: true,
      where: {
        camp_id: campaignId,
      },
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM TestTargets
              WHERE TestTargets.testId = Tests.id
            )`),
            'targetCount',
          ],
        ],
      },
    });

    const results = [];
    for (const test of tests) {
          // Get all target data associated with the test
          const targetAssociations = await TestTargets.findAll({
              where: { testId: test.id, clicked: true },
              raw: true,
          });

          const targetIds = targetAssociations.map((association) => association.targetId);
          const targets = await Targets.findAll({
              where: { id: targetIds, },
              raw: true,
          });
          
        results.push({
          testTitle: test.title,
          targets: targets.map(target => ({
            name: `${target.FirstName} ${target.LastName}`,
            department: target.Department,
            supervisor: target.Supervisor,
            email: target.EmailAddress,
          }))
        });
      }

    const user = await clerkClient.users.getUser(campaign.owner);

    if (!campaign) {
      return res.status(404).send('Campaign not found.');
    }

    res.render('campaign_manage', {
      title: 'Campaign Manager',
      description: 'Here, you can manage your campaign. Import users, create tests, set schedules, etc.',
      campaign: campaign.get({ plain: true }),
      user,
      statusText,
      tests: tests || [],
      results: results, // Change here to pass the modified results
    });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).send('Server Error');
  }
});

router.post('/toggle-status/:id', async (req, res) => {
  const campaignId = req.params.id;

  try {
    const campaign = await Campaigns.findByPk(campaignId);

    if (!campaign) {
      return res.status(404).send('Campaign not found');
    }

    // Toggle the status
    campaign.status = !campaign.status;
    await campaign.save();

    res.status(200).json({ status: campaign.status });
  } catch (error) {
    console.error('Error toggling campaign status:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
