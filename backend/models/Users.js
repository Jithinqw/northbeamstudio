const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Sequelize = require('sequelize');
class User extends Model {
    static initModel(sequelize) {
        User.init({
            id: {
                type: Sequelize.DataTypes.UUID,
                defaultValue: Sequelize.DataTypes.UUIDV4,
                primaryKey: true,
            },
            email: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                }
            },
            password_hash: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: Sequelize.DataTypes.ENUM('user', 'admin'),
                defaultValue: 'user',
            },
            status: {
                type: Sequelize.DataTypes.ENUM('active', 'suspended', 'pending'),
                defaultValue: 'pending',
            }
        }, {
            sequelize,
            modelName: "User",
            tableName: "users",
            underscored: true,
            timestamps: true
        })
        return User;
    }
}
module.exports = User;
