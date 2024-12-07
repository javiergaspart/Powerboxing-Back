const sessionService = require('../services/sessionService');

// Create a new session
const createSession = async (req, res) => {
  try {
    const session = await sessionService.createSession(req.body);
    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      data: session,
    });
  } catch (error) {
    console.error('Error in createSession:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all sessions
const getSessions = async (req, res) => {
  try {
    const sessions = await sessionService.getSessions();
    res.status(200).json({
      success: true,
      message: 'Sessions retrieved successfully',
      data: sessions,
    });
  } catch (error) {
    console.error('Error in getSessions:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get upcoming sessions by location
const getUpcomingSessions = async (req, res) => {
  try {
    await sessionService.getUpcomingSessions(req, res); // Delegating directly to the service
  } catch (error) {
    console.error('Error in getUpcomingSessions:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get previous sessions for a user
const getPreviousSessions = async (req, res) => {
  try {
    await sessionService.getPreviousSessions(req, res); // Delegating directly to the service
  } catch (error) {
    console.error('Error in getPreviousSessions:', error);
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
