const path = require('path');

const express = require('express');

const purchaseController = require('../expenseController/purchase');
const userAuthentication = require('../middleware/auth')

const router = express.Router();

router.get("/expense/buypremium", userAuthentication.autheticate, purchaseController.purchasePremium );

router.post("/expense/updatestatus", userAuthentication.autheticate, purchaseController.updateStatus)
 

module.exports = router