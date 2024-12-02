const { DataTypes } = require('sequelize');
//const Targets = require('./Targets')
//const Tests = require('./Tests')
const sequelize = require('../config/database');

const TargetTests = sequelize.define('TargetTests', {
    id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
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