const Sequelize = require('sequelize');

const sequelize = require('../ExpenseUtil/database');

const ExpenseDetails = sequelize.define('expenseDetails', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  amount: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = ExpenseDetails;


// 