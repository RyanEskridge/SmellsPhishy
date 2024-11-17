const { DataTypes } = require('sequelize');
//const Targets = require('./Targets')
//const Tests = require('./Tests')
const sequelize = require('../config/database');

const TargetTests = sequelize.define('TargetTests', {
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