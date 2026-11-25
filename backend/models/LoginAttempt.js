const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Sequelize = require('sequelize');
class LoginAttempt extends Model {
    static initModel(sequelize) {
        LoginAttempt.init({
            user_id: {
                type: Sequelize.DataTypes.UUID,
                allowNull: false,
            },
            email: {
                type: Sequelize.DataTypes.STRING,
                allowNull: true,
            },
            user_id: {
                type: Sequelize.DataTypes.UUID,
                allowNull: true,
            },
            success: {
                type: Sequelize.DataTypes.BOOLEAN,
                allowNull: false,
            },
            ip_address: Sequelize.DataTypes.STRING(45),
            user_agent: Sequelize.DataTypes.TEXT,
        }, {
            sequelize,
            modelName: 'LoginAttempt',
            tableName: 'login_attempts',
            timestamps: true,
            underscored: true,
        });
    }
}
module.exports = LoginAttempt;
