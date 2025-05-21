const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// ✅ Save trainer availability and create sessions
router.post('/saveTrainerSlots', sessionController.saveTrainerSlots);

// ✅ Fetch all slots created by this trainer
router.get('/trainer/:trainerId/slots', sessionController.getTrainerSlots);

module.exports = router;
