const { Datatypes, Model } = require('sequelize');
const sequelize = require('../config/database');
var Sequelize = require('sequelize');


class DocumentVersion extends Model {
    static initModel(sequelize) {
        DocumentVersion.init({

            id: {
                type: Sequelize.DataTypes.UUID,
                defaultValue: Sequelize.DataTypes.UUIDV4,
                primaryKey: true,
            },
            document_id: {
                type: Sequelize.DataTypes.UUID,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.DataTypes.UUID,
                allowNull: false,
            },
            version_number: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            title: {
                type: Sequelize.DataTypes.STRING(255),
                allowNull: false,
            },
            content: {
                type: Sequelize.DataTypes.TEXT,
                allowNull: true,
            },
        }, {
            sequelize,
            modelName: "DocumentVersion",
            tableName: 'document_versions',
            timestamps: true,
            underscored: true,
            updatedAt: 'created_at',
            indexes: [{
                unique: true,
                fields: ['document_id', 'version_number']
            }]
        });
    }
}

module.exports = DocumentVersion;
