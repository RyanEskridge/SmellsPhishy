const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Campaigns = sequelize.define(
    'Campaigns',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            unique:true
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