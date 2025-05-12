const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  phone: { type: String },
  availability: [
    {
      date: String, // "2025-04-15"
      timeSlots: [String] // ["10:00", "12:00"]
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);
