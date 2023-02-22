
const path = require('path');

const express = require('express');

const ExpenseController = require('../expenseController/expenseDetails');
const { route } = require('./expense');

const userAuthentication = require('../middleware/auth')

const router = express.Router();

router.post("/expense/addExpense", userAuthentication.autheticate, ExpenseController.addExpense);

router.get("/expense/userExpenses", userAuthentication.autheticate, ExpenseController.getExpense);
  
router.delete("/expense/deleteExpense/:id", userAuthentication.autheticate, ExpenseController.deleteExpense);


module.exports = router;