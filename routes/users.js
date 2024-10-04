const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('users', {
        title: 'Users',
        description: 'Browse all users.',
    });
});

router.get('/new', (req, res) => {
    res.render('users_new', {
        title: 'Create New User',
        description: 'Create a new user here.',
    });
});

module.exports = router;
