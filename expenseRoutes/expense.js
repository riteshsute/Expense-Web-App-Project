const path = require('path');

const express = require('express');

const ExpenseController = require('../expenseController/expense');

const router = express.Router();

router.post('/expense/signup', ExpenseController.signUpUser);

module.exports = router