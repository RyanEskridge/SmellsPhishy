const { Sequelize } = require('sequelize');

// Create a new Sequelize instance and connect to an SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false // Disable logging, set to true for debugging
});

module.exports = sequelize;
