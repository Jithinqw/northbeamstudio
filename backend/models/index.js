'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const User = require("./Users");
const Session = require("./Session");
const LoginAttempt = require("./LoginAttempt");
const Document = require("./Document");
const DocumentVersion = require("./DocumentVersion");
const AuditLog = require("./AuditLogs");
const SessionRefreshToken = require("./SessionRefreshToken");

// Initialize models
User.initModel(sequelize);
Session.initModel(sequelize);
LoginAttempt.initModel(sequelize);
Document.initModel(sequelize);
DocumentVersion.initModel(sequelize);
// AuditLog.initModel(sequelize);
SessionRefreshToken.initModel(sequelize);

// User relationships
User.hasMany(Session, { foreignKey: "user_id" });
Session.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(LoginAttempt, { foreignKey: "user_id" });
LoginAttempt.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Document, { foreignKey: "user_id" });
Document.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(DocumentVersion, { foreignKey: "user_id" });
DocumentVersion.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(AuditLog, { foreignKey: "user_id" });
AuditLog.belongsTo(User, { foreignKey: "user_id" });

// Document relationships
Document.hasMany(DocumentVersion, {
  foreignKey: "document_id",
  onDelete: "RESTRICT"
});

DocumentVersion.belongsTo(Document, {
  foreignKey: "document_id"
});

Session.hasMany(SessionRefreshToken, {
    foreignKey: "session_id",
    onDelete: "CASCADE"
});

SessionRefreshToken.belongsTo(Session, {
    foreignKey: "session_id"
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = {
  sequelize,
  User,
  Session,
  LoginAttempt,
  Document,
  DocumentVersion,
  MaintenanceSetting,
  AuditLog,
  db
};
