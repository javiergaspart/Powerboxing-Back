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
    const { userId, slotTiming, location, date } = req.body;
    if (!userId || !slotTiming || !location || !date) {
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

// Controller function to save trainer slots for a given day
const saveTrainerSlots = async (req, res) => {
  try {
    // Log the incoming request body for debugging
    console.log('Request Body:', req.body);

    // Check if the body contains necessary fields
    const { date, availableSlots, location, trainerId, slotTimings } = req.body;
    if (!date || !availableSlots || !location || !trainerId || !slotTimings) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields in the request body!',
      });
    }

    // Call the service function to save trainer slots
    const savedSession = await sessionService.saveTrainerSlots(req.body);

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Trainer slots saved successfully',
      data: savedSession,
    });
  } catch (error) {
    console.error('Error in saveTrainerSlots:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Controller to handle fetching available sessions for a given date from current time onwards
const getAvailableSessionsForDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, message: "Date is required" });
    }

    // Fetch available sessions using the service function
    const availableSessions = await sessionService.getAvailableSessionsForDate(date);

    if (availableSessions.length === 0) {
      return res.status(404).json({ success: false, message: "No available sessions for this date" });
    }

    return res.status(200).json({
      success: true,
      message: 'Available sessions fetched successfully',
      data: availableSessions,
    });
  } catch (error) {
    console.error('Error in getAvailableSessionsForDate:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch sessions',
    });
  }
};


// Controller for deleting a session
const deleteSessionByDateTime = async (req, res) => {
  const { trainerId } = req.params;
  const { date, time } = req.body;

  try {
    const deleted = await sessionService.deleteSessionByDateTime(trainerId, date, time);

    return res.status(200).json({
      success: true,
      message: 'Session deleted successfully.',
      data: deleted,
    });
  } catch (error) {
    console.error('❌ Error in deleteSessionByDateTime:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSessionsByTrainer = async (req, res) => {
  const { trainerId } = req.params;
  const { date } = req.query;

  // Ensure the date is valid
  const parsedDate = Date.parse(date);

  if (isNaN(parsedDate)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid date format. Please provide a valid date.',
    });
  }

  try {
    const sessions = await sessionService.getSessionsByTrainer(trainerId, new Date(parsedDate));
    return res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error('❌ Error in getSessionsByTrainer:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getAllSlotsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required in query params' });
    }

    const slots = await sessionService.fetchAllSlotsByDate(date);
    res.json({ success: true, data: slots });
  } catch (error) {
    console.error('Error in getAllSlotsByDate:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getSessionDetails = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const sessionDetails = await sessionService.getSessionDetails(sessionId);
    return res.status(200).json({
      status: 'success',
      data: sessionDetails,
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

const mapUsersToPunchingBags = async (req, res) => {
  const sessionId = req.params.sessionId;
  const { mappings } = req.body;

  if (!Array.isArray(mappings)) {
    return res.status(400).json({ error: 'Mappings must be an array' });
  }

  try {
    const updatedSession = await sessionService.mapUsersToPunchingBags(sessionId, mappings);
    res.status(200).json({
      message: 'User-punching bag mapping saved successfully',
      session: updatedSession,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getSessionDetails,
  createorReserveSession,
  getSessions,
  getUpcomingSessions,
  getPreviousSessions,
  checkSessionAvailability,
  saveTrainerSlots,
  getAvailableSessionsForDate,
  deleteSessionByDateTime,
  getSessionsByTrainer,
  getAllSlotsByDate,
  mapUsersToPunchingBags,
};