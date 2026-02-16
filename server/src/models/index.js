const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig);

// Import models
const User = require('./User')(sequelize);
const Transaction = require('./Transaction')(sequelize);
const Tag = require('./Tag')(sequelize);

// Define associations
const models = { User, Transaction, Tag };

Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
};
