// src/controllers/sensorController.js

const sensorService = require('../services/sensorService');
const Sensor = require("../models/Sensor");

const createSensor = async (req, res) => {
  try {
    const { punchingBagId, sessionData } = req.body; // Extracting data from request body

    // Check if sessionData is provided
    if (!sessionData || !Array.isArray(sessionData) || sessionData.length === 0) {
      console.warn('Session data is missing or invalid:', sessionData);
      return res.status(400).json({ error: 'Session data is required and must be an array.' });
    }

    console.log('Creating sensor data for punchingBagId:', punchingBagId);
    
    // Create sensor data and calculate accuracy and total power
    const { accuracy, totalPower, successfulHits } = await sensorService.createSensorData(punchingBagId, sessionData);
    console.log('Sensor data created with Accuracy:', accuracy, 'Total Power:', totalPower, 'Successful Hits:', successfulHits);
    
    // Create a new sensor entry with calculated accuracy and total power
    const sensor = new Sensor({ punchingBagId, accuracy, power: totalPower });
    await sensor.save();
    console.log('Sensor saved successfully:', sensor);
    
    // Return the created sensor data
    res.status(201).json(sensor);
  } catch (error) {
    console.error('Error creating sensor:', error);
    res.status(400).json({ error: error.message });
  }
};

const getSensorsByPunchingBag = async (req, res) => {
  try {
    const { punchingBagId } = req.params;
    console.log('Fetching sensors for punchingBagId:', punchingBagId);
    
    const sensors = await sensorService.getSensorsByPunchingBag(punchingBagId);
    console.log('Sensors retrieved:', sensors);
    
    res.status(200).json(sensors);
  } catch (error) {
    console.error('Error fetching sensors:', error);
    res.status(500).json({ error: error.message });
  }
};

const calculateScores = async (req, res) => {
  try {
    const { punchingBagId } = req.params;
    console.log('Calculating scores for punchingBagId:', punchingBagId);
    
    const medals = await sensorService.calculateScores(punchingBagId);
    console.log('Scores calculated:', medals);
    
    res.status(200).json(medals);
  } catch (error) {
    console.error('Error calculating scores:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSensor,
  getSensorsByPunchingBag,
  calculateScores, // Add this line
};
