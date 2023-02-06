
const path = require('path');

const express = require('express');

const ExpenseController = require('../expenseController/expenseDetails');
const { route } = require('./expense');

const router = express.Router();

router.post("/expense/addExpense", ExpenseController.addExpense)

router.get("/expense/userExpenses", ExpenseController.getExpense);
  
module.exports = router;