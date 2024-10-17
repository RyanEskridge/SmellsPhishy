const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const dataFromFile = require('../helpers/dataFromFile');
const numHelper = require('../helpers/randomNumber');
const randomNumber = numHelper.generateRandomNumber();

const usersFile = path.join(__dirname, '../data/users.json');

const readUsersFromFile = (callback) => {
  fs.readFile(usersFile, 'utf8', (err, data) => {
    if (err) return callback(err, null);
    try {
      const users = JSON.parse(data || '[]'); 
      return callback(null, users);
    } catch (parseError) {
      return callback(parseError, null); 
    }
  });
};

const writeUsersToFile = (users, callback) => {
  fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
    if (err) return callback(err);
    callback(null);
  });
};

router.get('/', (req, res) => {
  readUsersFromFile((err, users) => {
    let errorMessage = err
      ? 'Unable to load user data. Please try again later.'
      : null;
    res.render('users', {
      users: users || [],
      title: 'Users',
      description: 'Create a new user or view all users.',
      errorMessage
    });
  });
});

router.get('/lists', (req, res) => {
  dataFromFile((err, lists) => {
    let errorMessage = err
      ? 'Unable to load lists data. Please try again later.'
      : null;
    res.render('user_lists', {
      lists: lists || [],
      title: 'Users',
      description: 'Browse all users.',
      errorMessage
    });
  }, 'lists.json');
});

router.post('/add', (req, res) => {
  const { firstName, lastName, email, jobTitle, supervisor, department } =
    req.body;
  const id = randomNumber;
  const dateAdded = new Date();

  const newUser = {
    id,
    firstName,
    lastName,
    email,
    jobTitle,
    supervisor,
    department,
    dateAdded
  };

  readUsersFromFile((err, users) => {
    if (err) return res.status(500).send('Server error');

    users.push(newUser);

    writeUsersToFile(users, (err) => {
      if (err) return res.status(500).send('Server error');
      res.redirect('/users');
    });
  });
});

router.delete('/delete/:id', (req, res) => {
  const userId = req.params.id;

  readUsersFromFile((err, users) => {
    if (err)
      return res.status(500).json({ message: 'Failed to read users data.' });

    const updatedUsers = users.filter((user) => user.id !== userId);

    if (users.length === updatedUsers.length) {
      return res.status(404).json({ message: 'User not found.' });
    }

    writeUsersToFile(updatedUsers, (err) => {
      if (err)
        return res
          .status(500)
          .json({ message: 'Failed to update users data.' });
      res.status(200).json({ message: 'User deleted successfully.' });
    });
  });
});

router.get('/:id', (req, res) => {
  const userId = req.params.id;

  readUsersFromFile((err, users) => {
    if (err)
      return res.status(500).json({ message: 'Failed to load users data.' });

    const user = users.find((user) => user.id === userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.status(200).json(user);
  });
});

router.put('/:id', (req, res) => {
  const userId = req.params.id;

  readUsersFromFile((err, users) => {
    if (err)
      return res.status(500).json({ message: 'Failed to load users data.' });

    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex === -1)
      return res.status(404).json({ message: 'User not found.' });

    users[userIndex] = { ...users[userIndex], ...req.body };

    writeUsersToFile(users, (err) => {
      if (err)
        return res
          .status(500)
          .json({ message: 'Failed to update users data.' });
      res.status(200).json({ message: 'User updated successfully.' });
    });
  });
});

module.exports = router;
