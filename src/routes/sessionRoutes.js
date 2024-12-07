// src/routes/sessionRoutes.js

const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// Route to create a new session
router.post('/create', sessionController.createSession);

// Route to fetch all sessions
router.get('/', sessionController.getSessions);

// Route to fetch upcoming sessions for a specific location
router.get('/upcoming', sessionController.getUpcomingSessions);

// Route to fetch previous sessions for a specific user
router.get('/previous', sessionController.getPreviousSessions);

module.exports = router;
