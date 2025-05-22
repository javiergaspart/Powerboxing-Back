const Trainer = require('../models/Trainer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Session = require('../models/Session');
const moment = require('moment');

exports.getSlotsForTrainerByDate = async (trainerId, dateStr) => {
  const requestedDate = moment(dateStr, 'YYYY-MM-DD');
  const today = moment().startOf('day');

  let startOfDay, endOfDay;

  if (requestedDate.isSame(today, 'day')) {
    const now = moment();
    const roundedMinutes = now.minute() % 30 === 0 ? now.minute() : (Math.floor(now.minute() / 30) + 1) * 30;
    const roundedStart = now.clone().minutes(roundedMinutes).seconds(0).milliseconds(0);

    // Handle edge case if rounding pushes to next hour
    if (roundedMinutes === 60) {
      roundedStart.add(1, 'hour').minutes(0);
    }

    startOfDay = roundedStart.toDate();
    endOfDay = moment().endOf('day').toDate();
  } else {
    startOfDay = requestedDate.startOf('day').toDate();
    endOfDay = requestedDate.endOf('day').toDate();
  }

  const sessions = await Session.find({
    trainerId: trainerId,
    date: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  });

  // ✅ Return slot for each session (used in frontend calendar)
  return sessions.map(session => ({
    slot: session.slot
  }));
};

exports.getPastSessionsByTrainer = async (trainerId, date) => {
  try {
    console.log("Fetching previous sessions");
    const now = new Date(); // Current time
    const inputDate = new Date(date); // Parse the input date

    const startOfDay = new Date(inputDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(inputDate.setHours(23, 59, 59, 999));

    let endTime = endOfDay;
    if (now.toDateString() === inputDate.toDateString()) {
      endTime = now;
    }

    const sessions = await Session.find({
      trainerId,
      date: { $gte: startOfDay, $lte: endTime }
    });

    const pastSessions = sessions.filter(session => {
      const [hours, minutes] = session.slotTiming.split(':');
      const [time, period] = minutes.split(' ');
      let hour = parseInt(hours);
      if (period === 'PM' && hour !== 12) hour += 12;
      else if (period === 'AM' && hour === 12) hour = 0;

      const sessionDateTime = new Date(session.date);
      sessionDateTime.setHours(hour, parseInt(time), 0, 0);

      return sessionDateTime < now;
    });

    return pastSessions;
  } catch (error) {
    console.error('❌ Error in getPastSessionsByTrainer:', error);
    throw new Error('Error fetching past sessions for trainer');
  }
};

exports.loginTrainer = async (email, password) => {
  console.log('[TrainerService] Login attempt for:', email);

  try {
    const trainer = await Trainer.findOne({ email });
    console.log('[TrainerService] Trainer lookup result:', trainer ? 'Found ✅' : 'Not found ❌');

    if (!trainer) {
      throw new Error('Trainer not found');
    }

    const isMatch = await bcrypt.compare(password, trainer.password);
    console.log('[TrainerService] Password match:', isMatch ? 'Yes ✅' : 'No ❌');

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: trainer._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    console.log('[TrainerService] JWT token created for trainer ID:', trainer._id);

    return {
      _id: trainer._id,
      name: trainer.name,
      email: trainer.email,
      token,
    };
  } catch (err) {
    console.error('[TrainerService] Login error:', err.message);
    throw err;
  }
};
