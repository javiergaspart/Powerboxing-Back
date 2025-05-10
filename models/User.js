// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    match: /^[6-9]\d{9}$/ // Indian phone number format
  },
  name: {
    type: String,
    required: true
  },
  sessionBalance: {
    type: Number,
    default: 1 // Trial session on sign-up
  },
  type: {
    type: String,
    enum: ['trial', 'newcomer', 'regular'],
    default: 'trial'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
