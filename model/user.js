const Sequelize = require('sequelize');

const sequelize = require('../ExpenseUtil/database');

const ExpenseUser = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }, 
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phonenumber: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  ispremiumuser: Sequelize.BOOLEAN
});

module.exports = ExpenseUser;


// 