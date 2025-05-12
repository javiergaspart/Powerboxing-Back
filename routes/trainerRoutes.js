const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');

router.post('/login', trainerController.loginTrainer);

// Route to get past sessions for a specific trainer on a given date
router.get('/:trainerId/past-sessions', trainerController.getPastSessionsByTrainer);

module.exports = router;
