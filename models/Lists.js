const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lists = sequelize.define(
  'Lists',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ListName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ListDescription: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ListTargets: {
        type: DataTypes.JSON, 
        allowNull: false,
        defaultValue: [],
    }
  },
  {
    tableName: 'Lists',
    timestamps: true
  }
);

module.exports = Lists;