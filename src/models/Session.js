const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9] [APap][mM] - ([01]?[0-9]|2[0-3]):[0-5][0-9] [APap][mM]$/.test(v);
      },
      message: (props) => `${props.value} is not a valid time slot!`,
    },
  },
  location: {
    type: String,
    required: true,
  },
  availableSlots: {
    type: Number,
    required: true,
  },
  totalSlots: {
    type: Number,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  punchingBags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PunchingBag',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
