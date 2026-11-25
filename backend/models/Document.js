const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Sequelize = require('sequelize');
class Document extends Model {
    static initModel(sequelize) {
        Document.init({
            id: {
                type: Sequelize.DataTypes.UUID,
                defaultValue: Sequelize.DataTypes.UUIDV4,
                primaryKey: true,
            },
            user_id: {
                type: Sequelize.DataTypes.UUID,
                defaultValue: Sequelize.DataTypes.UUIDV4,
                allowNull: false,
            },
            title: {
                type: Sequelize.DataTypes.STRING(255),
                allowNull: false,
            },
            slug: {
                type: Sequelize.DataTypes.STRING(255),
                allowNull: false,
            },
            content: {
                type: Sequelize.DataTypes.TEXT,
                allowNull: true,
                defaultValue: "",
            },
            metadata: {
                type: Sequelize.DataTypes.JSONB,
                allowNull: true,
                defaultValue: {},
            },
            deleted_at: {
                type: Sequelize.DataTypes.DATE,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.DataTypes.NOW,
            }
        }, {
            sequelize,
            modelName: "Document",
            tableName: 'documents',
            timestamps: true,
            underscored: true,
            deleteAt: 'deleted_at',
            paranoid: true,
            indexes: [{
                unique: true,
                fields: ['user_id', 'slug']
            }],
        });
        return Document;
    }
}

module.exports = Document;
