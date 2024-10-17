const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const numHelper = require('../helpers/randomNumber');
const randomNumber = numHelper.generateRandomNumber();

const usersFile = path.join(__dirname, '../data/users.json');
const listsFile = path.join(__dirname, '../data/list.json');

const readUsersFromFile = (filePath, callback) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return callback(err, null);
    try {
      const objects = JSON.parse(data || '[]'); 
      return callback(null, objects);
    } catch (parseError) {
      return callback(parseError, null); 
    }
  });
};

const writeUsersToFile = (filePath, objects, callback) => {
  fs.writeFile(filePath, JSON.stringify(objects, null, 2), (err) => {
    if (err) return callback(err);
    callback(null);
  });
};

router.get('/', (req, res) => {
  readUsersFromFile(usersFile, (err, users) => {
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
  readUsersFromFile(listsFile, (err, users) => {
    let errorMessage = err
      ? 'Unable to load list data. Please try again later.'
      : null;
      res.render('user_lists', {
        lists: lists || [],
        title: 'User lists',
        description: 'Browse all lists.',
        errorMessage
      });
  });
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

  readUsersFromFile(usersFile, (err, users) => {
    if (err) return res.status(500).send('Server error');

    users.push(newUser);

    writeUsersToFile(usersFile, users, (err) => {
      if (err) return res.status(500).send('Server error');
      res.redirect('/users');
    });
  });
});

router.delete('/delete/:id', (req, res) => {
  const userId = req.params.id;

  readUsersFromFile(usersFile, (err, users) => {
    if (err)
      return res.status(500).json({ message: 'Failed to read users data.' });

    const updatedUsers = users.filter((user) => user.id !== userId);

    if (users.length === updatedUsers.length) {
      return res.status(404).json({ message: 'User not found.' });
    }

    writeUsersToFile(usersFile, updatedUsers, (err) => {
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

  readUsersFromFile(usersFile, (err, users) => {
    if (err)
      return res.status(500).json({ message: 'Failed to load users data.' });

    const user = users.find((user) => user.id === userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.status(200).json(user);
  });
});

router.put('/:id', (req, res) => {
  const userId = req.params.id;

  readUsersFromFile(usersFile, (err, users) => {
    if (err)
      return res.status(500).json({ message: 'Failed to load users data.' });

    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1)
      return res.status(404).json({ message: 'User not found.' });

    users[userIndex] = { ...users[userIndex], ...req.body };

    writeUsersToFile(usersFile, users, (err) => {
      if (err)
        return res
          .status(500)
          .json({ message: 'Failed to update users data.' });
      res.status(200).json({ message: 'User updated successfully.' });
    });
  });
});

module.exports = router;
