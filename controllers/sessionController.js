// controllers/sessionController.js
const Session = require('../models/Session');

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
    const sessions = await Session.find({ trainer: trainerId });
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
      trainer: trainerId,
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

// ✅ Book a session
const bookSession = async (req, res) => {
  const { sessionId, userId } = req.body;
  try {
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    session.participants.push(userId);
    session.availableSlots = Math.max(0, session.availableSlots - 1);
    await session.save();
    res.status(200).json({ message: 'Session booked', session });
  } catch (err) {
    res.status(500).json({ error: 'Failed to book session' });
  }
};

// ✅ Get session details by session ID
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

// ✅ Save trainer slots
const saveTrainerSlots = async (req, res) => {
  const { trainerId, slots } = req.body;

  if (!trainerId || !Array.isArray(slots)) {
    return res.status(400).json({ message: 'Trainer ID and slots array are required.' });
  }

  try {
    await Session.deleteMany({ trainer: trainerId });

    const newSessions = slots.map((slot) => ({
      trainer: trainerId,
      slot,
      participants: [],
      totalSlots: 18, // ✅ Number of punching bag stations
      availableSlots: 18,
      location: 'Hyderabad Studio',
      date: slot.split(':')[0].replaceAll('.', '-'),
    }));

    await Session.insertMany(newSessions);

    res.status(200).json({ message: 'Slots saved successfully.', count: newSessions.length });
  } catch (error) {
    console.error('❌ Error saving trainer slots:', error);
    res.status(500).json({ message: 'Internal server error', error });
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
};
