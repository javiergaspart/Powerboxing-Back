// src/routes/sensorRoutes.js

const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

// Route to create a new sensor
router.post('/', sensorController.createSensor);

// Route to get sensors by punching bag ID
router.get('/punchingBag/:punchingBagId', sensorController.getSensorsByPunchingBag);

// Route to calculate scores for a specific punching bag ID
router.get('/scores/:punchingBagId', sensorController.calculateScores); // Add this line

module.exports = router;
