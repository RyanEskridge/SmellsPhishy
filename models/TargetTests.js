const { DataTypes } = require('sequelize');
const Targets = require('./Targets')
const Tests = require('./Tests')
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const TargetTests = sequelize.define(
    'TargetTests',
    {
        target_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Targets,
                key: 'id',
            },
        },
        test_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Tests,
                key: 'id',
            },
        },
        clicked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, 
    {
        tableName: 'TargetsTests',
        timestamps: true,
    },
);

module.exports = TargetTests;