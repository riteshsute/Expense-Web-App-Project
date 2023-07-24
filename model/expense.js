const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExpenseUser',
    required: true,
  },
});


module.exports = mongoose.model('Expense', expenseSchema);

// const Sequelize = require('sequelize');

// const sequelize = require('../ExpenseUtil/database');

// const ExpenseDetails = sequelize.define('expense', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   amount: {
//     type: Sequelize.DOUBLE,
//     allowNull: false  
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   category: {
//     type: Sequelize.STRING,
//     allowNull: false
//   }
// });

// module.exports = ExpenseDetails;


// // 