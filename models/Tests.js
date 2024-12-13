const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const EmailTemplate = require('./EmailTemplate');
const Campaigns = require('./Campaigns')
const sequelize = require('../config/database');

const Lists = require('./Lists');

const Tests = sequelize.define(
    'Tests',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
            primaryKey: true,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        camp_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Campaigns,
                key: 'id'
            },
            allowNull: false
        },
        template_id: {
            type: DataTypes.INTEGER,
            references: {
                model: EmailTemplate,
                key: 'id'
            },
            allowNull: false
        },
        list_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Lists,
                key: 'id'
            },
        },
        scheduled_time: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        option: {
            type: DataTypes.STRING,
            allowNull: false
        },
        owner: {
            type: DataTypes.TEXT,
            allowNull: false          
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }
)

module.exports = Tests;