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

module.exports = {
  getAllAvailableSessions,
  getTrainerSessions,
  createSession,
  bookSession,
  getSessionDetails,
  getUserBookings,
};
