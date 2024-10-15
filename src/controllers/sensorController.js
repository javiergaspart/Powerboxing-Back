// src/controllers/sensorController.js

const sensorService = require('../services/sensorService');

const createSensor = async (req, res) => {
  try {
    const sensor = await sensorService.createSensor(req.body.punchingBagId, req.body.accuracy, req.body.power);
    res.status(201).json(sensor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateSensorData = async (req, res) => {
  try {
    const { sensorId } = req.params;
    const updatedSensor = await sensorService.updateSensorData(sensorId, req.body.accuracy, req.body.power);
    res.status(200).json(updatedSensor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSensorsByPunchingBag = async (req, res) => {
  try {
    const { punchingBagId } = req.params;
    const sensors = await sensorService.getSensorsByPunchingBag(punchingBagId);
    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSensor,
  updateSensorData,
  getSensorsByPunchingBag,
};
