const express = require('express');
const router = express.Router();
const Tests = require('../models/Tests');
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

module.exports = router;