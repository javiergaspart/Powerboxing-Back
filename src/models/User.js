const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
  resetPasswordToken: { // Field for storing the password reset token
    type: String,
  },
  resetPasswordExpires: { // Field for storing token expiration time
    type: Date,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
