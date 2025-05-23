const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');

// ✅ Add GET login route by phone for Flutter
router.get('/trainer-login/:phone', trainerController.trainerLogin);

// ✅ Other routes
router.get('/:trainerId/slots', trainerController.getTrainerSlotsForDate);
router.get('/:trainerId/past-sessions', trainerController.getPastSessionsByTrainer);

module.exports = router;
