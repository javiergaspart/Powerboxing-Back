const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  joinDate: { type: Date, default: Date.now },
  newcomer: { type: Boolean, default: true },
  sessionBalance: { type: Number, default: 1 },
  role: { type: String, enum: ['user', 'trainer'], default: 'user' },
});

module.exports = mongoose.model('User', userSchema);
