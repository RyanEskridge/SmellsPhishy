const express = require('express');
const router = express.Router();
const Tests = require('../models/Tests');
const TestTargets = require('../models/TestTargets');
const Campaigns = require('../models/Campaigns');
const Lists = require('../models/Lists');
const EmailTemplate = require('../models/EmailTemplate');
const { clerkClient } = require('@clerk/express');

router.get('/create', async (req, res) => {
    const campId = req.query.camp_id;

    try {
        const campaign = await Campaigns.findByPk(campId);

        if (!campaign) {
            return res.status(404).send('Campaign not found.');
        }

        const targetLists = await Lists.findAll();
        const emailTemplates = await EmailTemplate.findAll();

        res.render('test_create', {
            title: 'Create New Test',
            description: 'Create a new test for your campaign.',
            campId,
            campaign: campaign.get({ plain: true }),
            targetLists: targetLists.map((list) => list.get({ plain: true })),
            emailTemplates: emailTemplates.map((template) => template.get({ plain: true })),
        });
    } catch (error) {
        console.error('Error fetching data for test creation:', error);
        res.status(500).send('Server Error');
    }
});

router.post('/create', async (req, res) => {
    const { camp_id, title, template_id, customContent, scheduledTime } = req.body;

    try {
        const test = await Tests.create({
            camp_id,
            title,
            template_id: template_id || null,
            owner: req.auth.userId,
            status: false,
        });

        // const testTarget = await TestTargets.create({
        //     testId: test.id,
        // });

        // Handle custom content if provided
        if (!template_id && customContent) {
            console.log('Custom Content:', customContent);
        }

        res.status(200).json({ message: 'Test created successfully', test });
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({ message: 'Failed to create test' });
    }
});


router.put('/update/status/:id', async (req, res) => {
    const testId = req.params.id; 
    const { status } = req.body;
    console.log(`ID: ${testId}`)
    console.log(`status: ${status}`)
    try {
      const test = await Tests.findByPk(testId);
  
      if (!test) {
        return res.status(404).json({ error: 'Test not found' });
      }
  
      test.status = status;
      await test.save();
  
      res.json({ message: 'Status updated successfully', test });
    } catch (error) {
      console.error('Error updating test status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.delete('/delete/:id', async (req, res) => {
    try {
        const deleted = await Tests.destroy({
          where: { id: req.params.id },
        });
        if (!deleted) {
          return res.status(404).json({ message: 'List not found.' });
        }
        res.status(200).json({ message: 'List deleted successfully.' });
      } catch (error) {
        res.status(500).json({ message: 'Failed to delete list.' });
      }

  });

module.exports = router;