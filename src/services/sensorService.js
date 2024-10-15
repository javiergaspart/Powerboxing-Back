// src/services/sensorService.js

const Sensor = require('../models/Sensor');

const createSensor = async (punchingBagId, accuracy, power) => {
  const sensor = new Sensor({ punchingBagId, accuracy, power });
  await sensor.save();
  return sensor;
};

const updateSensorData = async (sensorId, accuracy, power) => {
  return await Sensor.findByIdAndUpdate(sensorId, { accuracy, power }, { new: true });
};

const getSensorsByPunchingBag = async (punchingBagId) => {
  return await Sensor.find({ punchingBagId });
};

module.exports = {
  createSensor,
  updateSensorData,
  getSensorsByPunchingBag,
};
