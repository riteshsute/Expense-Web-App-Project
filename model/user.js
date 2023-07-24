const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseUserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phonenumber: {
    type: Number,
    required: true
  },
  ispremiumuser: {
    type: Boolean,
    default: false
  },
  total_expense: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('ExpenseUser', expenseUserSchema);




// const Sequelize = require('sequelize');

// const sequelize = require('../ExpenseUtil/database');

// const ExpenseUser = sequelize.define('user', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     unique: true
//   }, 
//   password: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   phonenumber: { 
//     type: Sequelize.DOUBLE,
//     allowNull: false 
//   },
//   ispremiumuser: Sequelize.BOOLEAN, 
//   total_expense: {
//     type: Sequelize.INTEGER,
//     defaultValue : 0
//   }
// });  

// module.exports = ExpenseUser;


// // 