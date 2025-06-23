// src/models/PunchResult.js

const mongoose = require('mongoose');

const punchResultSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  power: {
    type: Number,
    required: true,
  },
  accuracy: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const PunchResult = mongoose.model('PunchResult', punchResultSchema);
module.exports = PunchResult;
