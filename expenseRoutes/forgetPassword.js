const path = require('path');

const express = require('express');

const forgetPasswordController = require('../expenseController/forgetPassword');

const userAuthentication = require('../middleware/auth')

const router = express.Router();

router.post('/forgotpassword', userAuthentication.autheticate, forgetPasswordController.forgetPassword);
  
router.get('/reset-password/:id', forgetPasswordController.resetPasswordForm)

router.get('/updatePassword/:resetpasswordid', forgetPasswordController.resetPassword)


module.exports = router;