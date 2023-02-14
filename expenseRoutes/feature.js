const path = require('path');

const express = require('express');

const leaderboardController = require('../expenseController/feature');
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.get("/expense/showLeaderBoard", userAuthentication.autheticate, leaderboardController.getUserLeaderboard);

module.exports = router;