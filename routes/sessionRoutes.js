// routes/sessionRoutes.js

const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// ✅ TEMP HOMESCREEN
router.get('/available', sessionController.getAllAvailableSessions);

// ✅ TRAINER DASHBOARD
router.get('/trainer/:trainerId/slots', sessionController.getTrainerSessions);
router.post('/trainer/:trainerId/create', sessionController.createSession);

// ✅ USER BOOKING
router.post('/book', sessionController.bookSession);

// ✅ SESSION DETAILS
router.get('/:sessionId/details', sessionController.getSessionDetails);

// ✅ USER BOOKINGS
router.get('/user/:userId/bookings', sessionController.getUserBookings);

module.exports = router;
