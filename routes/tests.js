const express = require('express');
const router = express.Router();
const { EmailTemplate, Targets, Lists, Tests, TestTargets, Campaigns } = require('../models');
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
        const allTargets = await Targets.findAll();

        res.render('test_create', {
            title: 'Create New Test',
            description: 'Create a new test for your campaign.',
            campId,
            targets: allTargets.map((target) => target.get({ plain: true })),
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
    const { camp_id, title, template_id, customContent, targetList, individualEmail, scheduledTime } = req.body;
    console.log( scheduledTime);
    try {
        const test = await Tests.create({
            camp_id,
            title,
            template_id: template_id || null,
            list_id: targetList,
            scheduled_time: scheduledTime,
            owner: req.auth.userId,
            status: false,
        });

        if (targetList) {
          const list = await Lists.findOne({ 
            where: { id: targetList }, 
            attributes: ['ListTargets']
          });
        
          if (!list || !list.ListTargets?.length) {
              return res.status(404).json({ message: 'Target list not found or empty' });
          }

          const targets = list.ListTargets;
          console.log('ListTargets:', list.ListTargets);
          const testId = test.id;
          const testTargets = targets.map(targetId => ({
            targetId: targetId,
            testId: testId,
          }));

          console.log("testTargets: ", testTargets);
          
          await TestTargets.bulkCreate(testTargets);
        } 

        if (individualEmail) {
          const target = await Targets.findOne({ 
            where: { id: individualEmail }, 
          });

          const testTargets = {
            targetId: target.id,
            testId: test.id,
          }

          await TestTargets.bulkCreate(testTargets);
          console.log(individualEmail);
        }
      
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
        // Delete TestTargets
        await TestTargets.destroy({
          where: { testId: req.params.id },
        });

        // Delete Test
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

  router.get('/edit/:id', async (req, res) => {
    const testId = req.params.id;

    try {
      const test = await Tests.findByPk(testId);

      if (!test) {
        return res.status(404).send('Test not found');
      }

      const targetLists = await Lists.findAll();
      const emailTemplates = await EmailTemplate.findAll();
      const allTargets = await Targets.findAll();

      res.render('test_edit', {
        title: 'Edit Test',
        description: 'Update the test details below.',
        campaign: campaign.get({ plain: true }),
        test: test.get({ plain: true }),
        targets: allTargets.map((target) => target.get({ plain: true })),
        targetLists: targetLists.map((list) => list.get({ plain: true })),
        emailTemplates: emailTemplates.map((template) => template.get({ plain: true })),
      });
    } catch (error) {
      console.error('Error fetching test:', error);
      res.status(500).send('Server Error');
    }
});

router.put('/update/:id', async (req, res) => {
  const testId = req.params.id;
  const { title, template_id, customContent, targetList, individualEmail, scheduledTime } = req.body;

  try {
    // Find the test by ID
    const test = await Tests.findByPk(testId);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Update the test details
    await test.update({
      title,
      template_id: template_id || null,
      list_id: targetList || null,
      scheduled_time: scheduledTime
    });

    // Clear previous test targets
    await TestTargets.destroy({ where: { testId } });

    // Handle Target List
    if (targetList) {
      const list = await Lists.findOne({
        where: { id: targetList },
        attributes: ['ListTargets']
      });

      if (!list || !list.ListTargets?.length) {
        return res.status(404).json({ message: 'Target list not found or empty' });
      }

      const targets = list.ListTargets;
      const testTargets = targets.map(targetId => ({
        targetId: targetId,
        testId: test.id
      }));

      await TestTargets.bulkCreate(testTargets);
    }

    // Handle Individual Email
    if (individualEmail) {
      const target = await Targets.findOne({ where: { id: individualEmail } });
      if (!target) {
        return res.status(404).json({ message: 'Target not found' });
      }

      await TestTargets.create({
        targetId: target.id,
        testId: test.id
      });
    }

    // Handle Custom Content
    if (!template_id && customContent) {
      console.log('Custom Content:', customContent);
    }

    res.status(200).json({ message: 'Test updated successfully', test });
  } catch (error) {
    console.error('Error updating test:', error);
    res.status(500).json({ message: 'Failed to update test', error: error.message });
  }
});

module.exports = router;