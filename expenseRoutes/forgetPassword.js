const path = require('path');

const express = require('express');

const forgetPasswordController = require('../expenseController/forgetPassword');

const router = express.Router();

router.post('/password/forgotpassword', forgetPasswordController.forgetPassword);
  
module.exports = router;