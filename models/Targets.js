const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Targets = sequelize.define(
  'Targets',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
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