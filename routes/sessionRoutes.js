// routes/sessionRoutes.js

const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// ✅ TEMP HOMESCREEN
router.get('/fitboxing/sessions/available', sessionController.getAllAvailableSessions);

// ✅ TRAINER DASHBOARD
router.get('/fitboxing/sessions/trainer/:trainerId/slots', sessionController.getTrainerSessions);
router.post('/fitboxing/sessions/trainer/:trainerId/create', sessionController.createSession);

// ✅ USER BOOKING
router.post('/fitboxing/sessions/book', sessionController.bookSession);

// ✅ SESSION DETAILS
router.get('/fitboxing/sessions/:sessionId/details', sessionController.getSessionDetails);

// ✅ USER BOOKINGS
router.get('/fitboxing/sessions/user/:userId/bookings', sessionController.getUserBookings);

module.exports = router;
