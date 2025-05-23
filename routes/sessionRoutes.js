const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// ✅ PUBLIC GET route for fetching all available sessions (used in TempHomeScreen)
router.get('/fitboxing/sessions/available', sessionController.getAllAvailableSessions);

// ✅ GET route for trainer sessions
router.get('/fitboxing/sessions/trainer/:trainerId/slots', sessionController.getTrainerSlots);

// ✅ POST route for creating trainer sessions
router.post('/fitboxing/sessions/create', sessionController.saveTrainerSlots);

// ✅ POST route for user session booking (optional - only if implemented)
router.post('/fitboxing/sessions/book', (req, res) => {
  res.status(501).json({ message: 'Booking route not implemented yet' });
});

// ✅ GET session details by ID (optional for frontend)
router.get('/fitboxing/sessions/:sessionId', (req, res) => {
  res.status(501).json({ message: 'Get session details not implemented yet' });
});

// ✅ GET all bookings by user (optional for frontend)
router.get('/fitboxing/bookings/user/:userId', (req, res) => {
  res.status(501).json({ message: 'Get user bookings not implemented yet' });
});

module.exports = router;
