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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Sensor', sensorSchema);
