const mongoose = require('mongoose');
const Session = require('../models/Session');
const User = require('../models/User');

// ✅ Get all available sessions for the temp homescreen
const getAllAvailableSessions = async (req, res) => {
  try {
    const sessions = await Session.find({});
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};

// ✅ Get sessions created by a specific trainer
const getTrainerSessions = async (req, res) => {
  const trainerId = req.params.trainerId;
  try {
    const sessions = await Session.find({
      trainer: new mongoose.Types.ObjectId(trainerId),
    }).sort({ date: 1, slot: 1 });

    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trainer sessions' });
  }
};

// ✅ Create a new session by a trainer
const createSession = async (req, res) => {
  const trainerId = req.params.trainerId;
  const { slot } = req.body;
  try {
    const newSession = new Session({
      trainer: new mongoose.Types.ObjectId(trainerId),
      slot,
      participants: [],
      totalSlots: 18,
      availableSlots: 18,
      location: 'Hyderabad Studio',
      date: slot.split(':')[0].replaceAll('.', '-'),
    });
    await newSession.save();
    res.status(201).json(newSession);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create session' });
  }
};

// ✅ BOOK A SESSION with logging and sessionBalance update
const bookSession = async (req, res) => {
  const { sessionId, userId } = req.body;

  try {
    console.log('📥 Booking request:', { sessionId, userId });

    const session = await Session.findById(sessionId);
    if (!session) {
      console.error('❌ Session not found:', sessionId);
      return res.status(404).json({ error: 'Session not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.error('❌ User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.sessionBalance <= 0) {
      console.warn('❌ Insufficient balance:', user.username);
      return res.status(400).json({ error: 'Insufficient session balance' });
    }

    if (session.participants.includes(userId)) {
      console.warn('❌ Duplicate booking attempt:', userId);
      return res.status(400).json({ error: 'User already booked this session' });
    }

    session.participants.push(userId);
    session.availableSlots = Math.max(0, session.availableSlots - 1);
    await session.save();

    user.sessionBalance -= 1;
    await user.save();

    console.log(`✅ Booking confirmed for ${user.username} | New balance: ${user.sessionBalance}`);

    res.status(200).json({ message: 'Session booked', session });
  } catch (err) {
    console.error('❌ Booking failed:', err.message);
    console.error(err.stack);
    res.status(500).json({ error: 'Booking failed', details: err.message });
  }
};

// ✅ Get session details by ID
const getSessionDetails = async (req, res) => {
  const { sessionId } = req.params;
  try {
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch session details' });
  }
};

// ✅ Get all bookings for a user
const getUserBookings = async (req, res) => {
  const userId = req.params.userId;
  try {
    const sessions = await Session.find({ participants: userId });
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user bookings' });
  }
};

// ✅ Overwrite mode — Save trainer slots
const saveTrainerSlots = async (req, res) => {
  const { trainerId, slots } = req.body;

  if (!trainerId || !Array.isArray(slots)) {
    return res.status(400).json({ message: 'Trainer ID and slots array are required.' });
  }

  try {
    await Session.deleteMany({ trainer: new mongoose.Types.ObjectId(trainerId) });

    const newSessions = slots.map((slot) => ({
      trainer: new mongoose.Types.ObjectId(trainerId),
      slot,
      participants: [],
      totalSlots: 18,
      availableSlots: 18,
      location: 'Hyderabad Studio',
      date: slot.split(':')[0].replaceAll('.', '-'),
    }));

    await Session.insertMany(newSessions);

    res.status(200).json({ message: 'Slots saved successfully.', count: newSessions.length });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// ✅ Merge-mode: Create sessions without duplicates
const createMultipleSessions = async (req, res) => {
  const { trainerId, slots } = req.body;

  if (!trainerId || !Array.isArray(slots)) {
    return res.status(400).json({ error: 'Trainer ID and slots required' });
  }

  try {
    const bulkOps = slots.map(slot => ({
      updateOne: {
        filter: { trainer: new mongoose.Types.ObjectId(trainerId), slot },
        update: {
          $setOnInsert: {
            trainer: new mongoose.Types.ObjectId(trainerId),
            slot,
            totalSlots: 18,
            availableSlots: 18,
            location: 'Hyderabad Studio',
            participants: [],
            userBagMapping: [],
            punchingBags: [],
            isCompleted: false,
            date: slot.split(':')[0].replaceAll('.', '-'),
          }
        },
        upsert: true
      }
    }));

    await Session.bulkWrite(bulkOps);
    res.status(200).json({ message: 'Sessions created/merged successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllAvailableSessions,
  getTrainerSessions,
  createSession,
  bookSession,
  getSessionDetails,
  getUserBookings,
  saveTrainerSlots,
  createMultipleSessions
};
