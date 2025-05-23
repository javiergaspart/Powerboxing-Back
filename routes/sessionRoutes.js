// sessionRoutes.js

const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// ✅ PUBLIC GET route for fetching all available sessions (used in TempHomeScreen)
router.get('/sessions/available', sessionController.getAllAvailableSessions);

// ✅ Existing GET route for fetching sessions created by a specific trainer
router.get('/fitboxing/sessions/trainer/:trainerId/slots', sessionController.getTrainerSessions);

// ✅ Existing POST route for creating a session by trainer
router.post('/fitboxing/sessions/create', sessionController.createSession);

// ✅ Existing POST route to book a session (used when user books one)
router.post('/fitboxing/sessions/book', sessionController.bookSession);

// ✅ GET route to fetch session details by ID (optional for frontend)
router.get('/fitboxing/sessions/:sessionId', sessionController.getSessionDetails);

// ✅ GET all bookings for a user (optional if needed later)
router.get('/fitboxing/bookings/user/:userId', sessionController.getUserBookings);

module.exports = router;
