// src/routes/sensorRoutes.js

const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

router.post('/', sensorController.createSensor);
router.put('/:sensorId', sensorController.updateSensorData);
router.get('/punchingBag/:punchingBagId', sensorController.getSensorsByPunchingBag);

module.exports = router;
