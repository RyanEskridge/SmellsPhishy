const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../config/database');

const TargetTests = sequelize.define('TargetTests', {
    id: {
        type: DataTypes.INTEGER, // Change to INTEGER to match database schema
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    targetId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Targets',
            key: 'id',
        },
    },
    testId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Tests',
            key: 'id',
        },
    },
    clicked: { 
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, { timestamps: false });

module.exports = TargetTests;