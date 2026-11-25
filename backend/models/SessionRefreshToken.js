const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");
const Sequelize = require("sequelize");
class SessionRefreshToken extends Model {
    static initModel(sequelize) {
        SessionRefreshToken.init({
            id: {
                type: Sequelize.DataTypes.UUID,
                defaultValue: Sequelize.DataTypes.UUIDV4,
                primaryKey: true
            },
            session_id: {
                type: Sequelize.DataTypes.UUID,
                allowNull: false
            },
            token_hash: {
                type: Sequelize.DataTypes.STRING(64),
                allowNull: false,
                unique: true
            },
            used_at: {
                type: Sequelize.DataTypes.DATE,
                allowNull: true
            },
            expires_at: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false
            }
        }, {
            sequelize,
            modelName: "SessionRefreshToken",
            tableName: "session_refresh_tokens",
            underscored: true,
            updatedAt: false
        });
        return SessionRefreshToken;
    }
}
module.exports = SessionRefreshToken;