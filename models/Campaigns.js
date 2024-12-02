const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../config/database');

const Campaigns = sequelize.define(
    'Campaigns',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        notes: {
            type: DataTypes.TEXT
        },
        owner: {
            type: DataTypes.TEXT,
            allowNull: false          
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    },
    {
        tableName: 'campaigns',
        timestamps: true      
    }
);

module.exports = Campaigns