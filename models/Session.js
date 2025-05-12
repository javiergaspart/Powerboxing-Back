const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  slotTiming: {
    type: String,
    validate: {
      validator: function (v) {
        // Remove special characters like non-breaking spaces
        v = v.replace(/\u202F|\u00A0/g, ' ').trim();
  
        const match = v.match(/^(\d{1,2}):(\d{2}) (AM|PM)$/);
        if (!match) return false;
  
        let [_, hourStr, minuteStr, period] = match;
        let hour = parseInt(hourStr, 10);
        let minute = parseInt(minuteStr, 10);
  
        if (hour < 1 || hour > 12 || minute > 59) return false;
  
        // Convert to 24-hour format
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
  
        const timeInMinutes = hour * 60 + minute;
        const minTime = 10 * 60; // 10:00 AM
        const maxTime = 18 * 60; // 6:00 PM
  
        return timeInMinutes >= minTime && timeInMinutes <= maxTime;
      },
      message: '{VALUE} is not a valid time between 10:00 AM and 6:00 PM!',
    },
  },  
  location: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
  },
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
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

  userBagMapping: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      punchingBagId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PunchingBag',
        required: true,
      },
    },
  ],
  
  isCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  availableSlots: {
    type: Number,
    required: true,
  },
  totalSlots: {
    type: Number,
    required: true,
  },
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
