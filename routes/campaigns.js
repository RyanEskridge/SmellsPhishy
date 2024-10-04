const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('campaigns', {
        title: 'Campaigns',
        description: 'List of campaigns.',
    });
});

router.get('/new', (req, res) => {
    res.render('campaigns_new', {
        title: 'Create New Campaign',
        description: 'Start a new campaign here.',
    });
});

module.exports = router;
