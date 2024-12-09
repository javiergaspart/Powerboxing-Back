const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  slotTimings: {
    type: String,
    required: true,
    enum: [
      '9:00 AM', '9:30 AM',
      '10:00 AM', '10:30 AM',
      '11:00 AM', '11:30 AM',
      '12:00 PM', '12:30 PM',
      '1:00 PM', '1:30 PM',
      '2:00 PM', '2:30 PM',
      '3:00 PM', '3:30 PM',
      '4:00 PM', '4:30 PM',
      '5:00 PM', '5:30 PM',
      '6:00 PM'
    ],
    validate: {
      validator: function (v) {
        return /\d{1,2}:\d{2} (AM|PM)/.test(v); // Regex for validating time formats
      },
      message: '{VALUE} is not a valid time slot!',
    },
  },
  location: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
  },
  bookedUsers: [
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
