// src/routes/sessionRoutes.js

const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// This route will create a new session with the provided session details.
router.post('/reserve-or-create', sessionController.createorReserveSession);

// This route will retrieve all the sessions from the database.
router.get('/', sessionController.getSessions);

// This route will retrieve upcoming sessions filtered by the provided location.
router.get('/upcoming', sessionController.getUpcomingSessions);

// This route will retrieve previous sessions attended by the user, based on their user ID.
router.get('/previous', sessionController.getPreviousSessions);

// This route checks if there are available slots for a specific session.
router.get('/session/:sessionId/availability', sessionController.checkSessionAvailability);


module.exports = router;
