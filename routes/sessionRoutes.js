const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// ✅ POST route to save trainer availability slots
router.post('/saveTrainerSlots', sessionController.saveTrainerSlots);

module.exports = router;
