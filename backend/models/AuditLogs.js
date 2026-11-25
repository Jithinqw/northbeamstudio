const { Model } = require('sequelize');
const sequelize = require('../config/database');
const Sequelize = require('sequelize');

const AuditLog = sequelize.define(
    "AuditLog",
    {
        id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: Sequelize.DataTypes.UUID,
            allowNull: false,
        },
        action: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: false
        },

        resource_type: Sequelize.DataTypes.STRING(100),
        resource_id: Sequelize.DataTypes.UUID,

        details: {
            type: Sequelize.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {}
        },

        ip_address: Sequelize.DataTypes.STRING(45)
    }, {
    sequelize,
    modelName: "AuditLog",
    tableName: "audit_logs",
    underscored: true,
    updatedAt: false
});

module.exports = AuditLog;
