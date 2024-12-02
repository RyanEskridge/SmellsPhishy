const express = require('express');
const router = express.Router();
const Tests = require('../models/Tests');
const Campaigns = require('../models/Campaigns');
const { clerkClient } = require('@clerk/express');

// Render the test creation form
router.get('/create', async (req, res) => {
    const campId = req.query.camp_id;

    try {
        const campaign = await Campaigns.findByPk(campId);

        if (!campaign) {
            return res.status(404).send('Campaign not found.');
        }

        res.render('test_create', {
            title: 'Create New Test',
            description: 'Create a new test for your campaign.',
            campId, // Pass camp_id to the form
            campaign: campaign.get({ plain: true })
        });
    } catch (error) {
        console.error('Error fetching campaign for test creation:', error);
        res.status(500).send('Server Error');
    }
});

// Handle test creation
router.post('/create', async (req, res) => {
    const { title, template_id, owner } = req.body;
    const camp_id = req.body.camp_id;

    try {
        const test = await Tests.create({ title, template_id, owner, camp_id });
        res.redirect(`/campaigns/manage/${camp_id}`);
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;