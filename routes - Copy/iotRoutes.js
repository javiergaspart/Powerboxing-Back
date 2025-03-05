const express = require('express');
const router = express.Router();
const { activateLeaderboardLight, activateFinalLeaderboardLight } = require('../controllers/iotController');

// Route to activate leaderboard lights after a round
router.post('/activate-leaderboard', activateLeaderboardLight);

// Route to activate final leaderboard lights after Round 8
router.post('/activate-final-leaderboard', activateFinalLeaderboardLight);

module.exports = router;
