const sessionService = require('../services/sessionService');

// Create a new session
const createorReserveSession = async (req, res) => {
  try {
    // Log the incoming request body
    console.log('Request Body:', req.body);

    // Check if the body is properly structured
    if (!req.body) {
      console.log('Request body is empty!');
      return res.status(400).json({
        success: false,
        error: 'Request body is missing!',
      });
    }

    // Check if necessary fields are present in the request body
    const { userId, slotTimings, location, date } = req.body;
    if (!userId || !slotTimings || !location || !date) {
      console.log('Missing required fields in request body:', req.body);
      return res.status(400).json({
        success: false,
        error: 'Missing required fields in the request body!',
      });
    }

    // Call the service function to reserve or create session
    console.log('Calling sessionService.reserveOrCreateSession...');
    await sessionService.reserveOrCreateSession(req.body, res);

    console.log('Session reservation or creation attempted successfully');
  } catch (error) {
    console.error('Error in createSession:', error);
    
    // Log error details to help with debugging
    console.error('Error Message:', error.message);
    console.error('Stack Trace:', error.stack);

    // Send error response to client
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

const checkSessionAvailability = async (req, res) => {
  try {
    const { sessionId } = req.params; // Get the sessionId from the URL parameter

    // Call the service method to check availability
    const isAvailable = await sessionService.checkSessionAvailability(sessionId);

    // Respond with the availability status
    res.status(200).json({
      success: true,
      available: isAvailable, // Return availability status
    });
  } catch (error) {
    console.error('Error in checkSessionAvailability:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createorReserveSession,
  getSessions,
  getUpcomingSessions,
  getPreviousSessions,
  checkSessionAvailability,
};