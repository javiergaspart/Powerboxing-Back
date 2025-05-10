// models/Trainer.js

const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    match: /^[6-9]\d{9}$/ // Validates Indian phone number format
  },
  name: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);
