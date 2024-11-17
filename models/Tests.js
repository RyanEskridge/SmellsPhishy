const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const EmailTemplate = require('./EmailTemplate');
const Campaigns = require('./Campaigns')
const sequelize = require('../config/database');

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