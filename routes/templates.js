const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('templates', {
        title: 'Templates',
        description: 'Browse all templates.',
    });
});

router.get('/new', (req, res) => {
    res.render('templates_new', {
        title: 'Create New Template',
        description: 'Create a new template here.',
    });

});

router.get('/test', (req, res) => {
    res.render('templates_test', {
        title: 'Test Template',
        description: 'Test a template here.',
    });
});

module.exports = router;
