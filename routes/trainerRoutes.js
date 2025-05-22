const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');

router.post('/login', trainerController.loginTrainer);

// ✅ Add this line to fix the issue
router.get('/:trainerId/slots', trainerController.getTrainerSlotsForDate);

router.get('/:trainerId/past-sessions', trainerController.getPastSessionsByTrainer);

module.exports = router;
