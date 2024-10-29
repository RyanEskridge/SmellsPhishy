const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Targets = sequelize.define(
  'Targets',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    FirstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    LastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    EmailAddress: {
      type: DataTypes.STRING,
      allowNull: false
    },
    JobTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Supervisor: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Department: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },
  {
    tableName: 'Targets',
    timestamps: true
  }
);

module.exports = Targets;