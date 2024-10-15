// src/models/Sensor.js

const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  punchingBagId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PunchingBag',
    required: true,
  },
  accuracy: {
    type: Number,
    required: true,
  },
  power: {
    type: Number,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Sensor = mongoose.model('Sensor', sensorSchema);
module.exports = Sensor;
