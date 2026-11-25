const { Datatypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Sequelize = require('sequelize');

class Session extends Model {
    static initModel(sequelize) {
        Session.init({
            id: {
                type: Sequelize.DataTypes.UUID,
                defaultValue: Sequelize.DataTypes.UUIDV4,
                primaryKey: true,
            },
            user_id: {
                type: Sequelize.DataTypes.UUID,
                allowNull: false,
            },
            refresh_token_hash: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            expires_at: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
            revoked_at: {
                type: Sequelize.DataTypes.DATE,
                allowNull: true,
            },
            ip_address: {
                type: Sequelize.DataTypes.STRING,
                allowNull: true,
            },
            user_agent: {
                type: Sequelize.DataTypes.STRING,
                allowNull: true,
            }
        }, {
            sequelize,
            modelName: 'Session',
            tableName: 'sessions',
            underscored: true,
            timestamps: true,
            updatedAt: false,
        })
        return Session;
    }
}
module.exports = Session;
