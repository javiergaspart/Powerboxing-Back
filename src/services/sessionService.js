// src/services/sessionService.js

const Session = require('../models/Session');
const mongoose = require('mongoose'); // Import mongoose

// Create a new session
const createSession = async (sessionData) => {
  const { participants, punchingBags } = sessionData;

  console.log('Creating session with the following data:', sessionData);

  if (!participants || !punchingBags) {
    console.error('Participants or punching bags are missing in the session data.');
    throw new Error('Participants and punching bags are required.');
  }

  if (punchingBags.length < participants.length) {
    console.error('Validation failed: The number of punching bags must be greater than or equal to the number of users.');
    throw new Error('The number of punching bags must be greater than or equal to the number of users.');
  }

  try {
    const session = new Session(sessionData);
    await session.save();
    console.log('Session created successfully:', session);
    return session;
  } catch (error) {
    console.error('Error saving session:', error);
    throw new Error('Failed to create session.');
  }
};

// Get all sessions
const getSessions = async () => {
  console.log('Fetching all sessions...');
  try {
    const sessions = await Session.find()
      .populate('participants')
      .populate('punchingBags');
    console.log(`Fetched ${sessions.length} sessions.`);
    return sessions;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw new Error('Failed to retrieve sessions.');
  }
};

// Get upcoming sessions by location
// Get upcoming sessions by location
const getUpcomingSessions = async (req, res) => {
  try {
    const { location } = req.query;

    // Log location for debugging
    console.log('Fetching upcoming sessions for location:', location);

    const sessions = await Session.find({
      date: { $gte: new Date() },
      location,
    }).populate('participants').populate('punchingBags');

    // Log number of sessions fetched
    console.log(`Fetched ${sessions.length} upcoming sessions for location: ${location}`);

    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    // Log the error
    console.error('Error fetching upcoming sessions:', error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get previous sessions for a user
const getPreviousSessions = async (req, res) => {
  try {
    const { userId } = req.query;  // Or req.body, depending on how you're sending the userId

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid User ID format" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);


    // Log the current date for debugging
    console.log('Current Date:', new Date());
    
    // Query to fetch previous sessions
    const sessions = await Session.find({
      date: { $lt: new Date() },  // Sessions that are in the past
      participants: userObjectId,  // Ensure the user is a participant
    }).populate('participants').populate('punchingBags');

    // Log the result before sending the response
    console.log('Fetched Sessions:', sessions);

    if (sessions.length === 0) {
      console.log(`No previous sessions found for user ${userId}`);
    }

    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error('Error fetching previous sessions:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


module.exports = {
  createSession,
  getSessions,
  getUpcomingSessions,
  getPreviousSessions,
};
