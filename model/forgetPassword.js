const Sequelize = require('sequelize');
const sequelize = require('../ExpenseUtil/database');
const {v4: uuidv4} = require('uuid')

const forgetPassword = sequelize.define('forgetPasswordRequest', {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true
  },
  isactive: {
    type: Sequelize.BOOLEAN
  }
});

module.exports = forgetPassword;
