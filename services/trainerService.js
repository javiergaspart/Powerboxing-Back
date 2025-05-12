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

  return sessions.map(session => ({
    time: moment(session.date).format('h:mm A')
  }));
};

exports.getPastSessionsByTrainer = async (trainerId, date) => {
  try {

    console.log("Fetching previous sessions");
    const now = new Date(); // Current time
    const inputDate = new Date(date); // Parse the input date

    // Set the start of the day for the given date (00:00:00)
    const startOfDay = new Date(inputDate.setHours(0, 0, 0, 0));

    // Set the end of the day for the given date (23:59:59.999)
    const endOfDay = new Date(inputDate.setHours(23, 59, 59, 999));

    // If the provided date is today, only fetch sessions before the current time
    let endTime = endOfDay;
    if (now.toDateString() === inputDate.toDateString()) {
      // If today, set endTime to the current time to ensure we don't include future sessions
      endTime = now;
    }

    // Fetch sessions for the trainer within the calculated date range
    const sessions = await Session.find({
      trainerId,
      date: { $gte: startOfDay, $lte: endTime }, // Sessions before current time for today, or all sessions for previous days
    });

    console.log("Past sessions: " + sessions);

     // Filter out future sessions (sessions that are still in the future)
    const pastSessions = sessions.filter(session => {
      // Combine date with slotTiming to create a full date-time
      const [hours, minutes] = session.slotTiming.split(':');
      const [time, period] = minutes.split(' ');
      let hour = parseInt(hours);
      if (period === 'PM' && hour !== 12) {
        hour += 12; // Convert PM hour to 24-hour format
      } else if (period === 'AM' && hour === 12) {
        hour = 0; // Convert 12 AM to 00
      }

      // Set the time to the session date
      const sessionDateTime = new Date(session.date);
      sessionDateTime.setHours(hour, parseInt(time), 0, 0);

      // Filter sessions that are in the past
      return sessionDateTime < now;
    });

    console.log("Past sessions: ", pastSessions);

    return pastSessions;

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
