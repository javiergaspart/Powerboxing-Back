// routes/sessionRoutes.js
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// ✅ TEMP HOMESCREEN
router.get('/available', sessionController.getAllAvailableSessions);

// ✅ NEW: GET sessions by date for calendar
router.get('/date/:date', sessionController.getSessionsByDate); // <-- ✅ this was missing

// ✅ TRAINER DASHBOARD
router.get('/trainer/:trainerId/slots', sessionController.getTrainerSessions);
router.post('/trainer/:trainerId/create', sessionController.createSession);
router.post('/saveTrainerSlots', sessionController.saveTrainerSlots); // ✅ Overwrites previous
router.post('/create-multiple', sessionController.createMultipleSessions); // ✅ Appends sessions

// ✅ USER BOOKING
router.post('/book', sessionController.bookSession);

// ✅ SESSION DETAILS
router.get('/:sessionId/details', sessionController.getSessionDetails);

// ✅ USER BOOKINGS
router.get('/user/:userId/bookings', sessionController.getUserBookings);

module.exports = router;
