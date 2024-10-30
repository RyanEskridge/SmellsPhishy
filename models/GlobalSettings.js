const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GlobalSettings = sequelize.define(
  'GlobalSettings',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ApiKey: {
      type: DataTypes.STRING,
      allowNull: false
    },
    CustomLink: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'GlobalSettings',
    timestamps: false
  }
);

module.exports = GlobalSettings;
