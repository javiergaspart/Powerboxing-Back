// src/routes/sessionRoutes.js

const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// Route to fetch session details by session ID
// router.get('/:sessionId', sessionController.getSessionDetails);

// This route will create a new session with the provided session details.
router.post('/book', sessionController.createorReserveSession);

// This route will retrieve all the sessions from the database.
router.get('/', sessionController.getSessions);

// This route will retrieve upcoming sessions filtered by the provided location.
router.get('/upcoming', sessionController.getUpcomingSessions);

// This route will retrieve previous sessions attended by the user, based on their user ID.
router.get('/previous', sessionController.getPreviousSessions);

// This route checks if there are available slots for a specific session.
router.get('/session/:sessionId/availability', sessionController.checkSessionAvailability);

// This route is to save trainer slots
router.post('/saveTrainerSlots', sessionController.saveTrainerSlots);

// Route to fetch available sessions for a specific date
router.get('/available', sessionController.getAvailableSessionsForDate);

// Route for deleting a trainer's session
router.post('/:trainerId/slot', sessionController.deleteSessionByDateTime);

// Route to get all sessions for a trainer
router.get('/trainer/:trainerId/slots', sessionController.getSessionsByTrainer);

// Route to get all sessions for the given date
router.get('/all-slots', sessionController.getAllSlotsByDate);

// Define the route to get session details by ID
router.get('/:id', sessionController.getSessionDetails);

// Map users and punching bags for a session
router.post('/:sessionId/map-users-to-bags', sessionController.mapUsersToPunchingBags);

module.exports = router;
