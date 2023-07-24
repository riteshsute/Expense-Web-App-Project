
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const forgetPasswordSchema = new mongoose.Schema({
    _id: {
      type: String,
      default: uuidv4,
    },
    userId: {
      type: String,
      required: true,
    },
    isactive: {
      type: Boolean,
      default: true,
    },
  });

module.exports = mongoose.model('ForgetPassword', forgetPasswordSchema);

// const Sequelize = require('sequelize');
// const sequelize = require('../ExpenseUtil/database');
// const {v4: uuidv4} = require('uuid')

// const forgetPassword = sequelize.define('forgetPasswordRequest', {
//   id: {
//     type: Sequelize.UUID,
//     allowNull: false,
//     primaryKey: true
//   },
//   isactive: {
//     type: Sequelize.BOOLEAN
//   }
// });

// module.exports = forgetPassword;
