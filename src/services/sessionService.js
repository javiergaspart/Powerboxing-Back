// src/services/sessionService.js

const Session = require('../models/Session');
const mongoose = require('mongoose'); // Import mongoose

// Create a new session
const reserveOrCreateSession = async (req, res) => {
  console.log("Request received:", req);

  const { userId, slotTimings, location, date } = req;
  console.log("Checking session for slotTimings:", slotTimings, "Location:", location, "Date:", date);

  const normalizedSlotTimings = slotTimings.replace(/\s/g, ' ').trim();
  const normalizedLocation = location.trim();
  const normalizedDate = new Date(date); // Ensure correct date format

  try {
    // Check if a session with the same slot timings, location, and date exists
    console.log("Searching for session with:", { slotTimings: normalizedSlotTimings, location: normalizedLocation, date: normalizedDate });
    let session = await Session.findOne({ slotTimings: normalizedSlotTimings, location: normalizedLocation, date: normalizedDate });

    console.log("Session found:", session);

    if (session) {
      console.log('Session already exists:', session);

      // If the user is already booked, return an error
      if (session.bookedUsers.includes(userId)) {
        return res.status(400).json({ message: 'User already reserved this session' });
      }

      // Check if slots are available
      const totalSlots = 20; // Default total slots
      if (session.bookedUsers.length >= totalSlots) {
        return res.status(400).json({ message: 'No available slots for this session' });
      }

      // Reserve the slot for the user
      session.bookedUsers.push(userId);
      console.log("Saving session after adding user:", session.bookedUsers);
      await session.save();

      return res.status(200).json({ message: 'Reservation successful', session });
    }

    // If no session exists, create a new session
    console.log('No existing session found. Creating a new session.');

    session = new Session({
      date: normalizedDate,
      slotTimings: normalizedSlotTimings,
      location: normalizedLocation,
      instructor: 'Default Instructor',
      bookedUsers: [userId],
    });

    await session.save();

    return res.status(200).json({ message: 'New session created and reservation successful', data: session });
  } catch (error) {
    console.error('Error in reserveOrCreateSession:', error);
    return res.status(500).json({ message: 'Failed to reserve or create session' });
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
    const { userId } = req.query; // Extract userId from route params

    // Log userId for debugging    
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid User ID format" });
    }

    console.log('Fetching sessions for user ID:', userId);

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find sessions where the user is part of bookedUsers and sort by date
    const sessions = await Session.find({
      date: { $gte: new Date() }, // Fetch only upcoming sessions
      bookedUsers: userObjectId, // Match sessions with this userId in bookedUsers
    }).populate('bookedUsers', 'username').populate('punchingBags')
      .sort({ date: 1 }); // Sort sessions by date in ascending order

    // Log number of sessions fetched
    console.log(`Fetched ${sessions.length} sessions for user ID: ${userId}`);

    const updatedSessions = sessions.map(session => ({
      ...session.toObject(),
      isCompleted: false,
    }));

    res.status(200).json({
      success: true,
      data: updatedSessions,
    });
  } catch (error) {
    // Log the error
    console.error('Error fetching user sessions:', error);

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
      bookedUsers: userObjectId,  // Ensure the user is a participant
    }).populate('bookedUsers', 'username').populate('punchingBags');

    // Log the result before sending the response
    console.log('Fetched Sessions:', sessions);

    if (sessions.length === 0) {
      console.log(`No previous sessions found for user ${userId}`);
    }
    const updatedSessions = sessions.map(session => ({
      ...session.toObject(),
      isCompleted: true,
    }));

    res.status(200).json({
      success: true,
      data: updatedSessions,
    });
  } catch (error) {
    console.error('Error fetching previous sessions:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const checkSessionAvailability = async (sessionId) => {
  try {
    // Validate session ID
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      throw new Error('Invalid session ID');
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      throw new Error('Session not found');
    }

    // Calculate availability
    const availableSlots = 20 - session.bookedUsers.length;
    const isAvailable = availableSlots > 0;

    return isAvailable;
  } catch (error) {
    console.error('Error checking session availability:', error);
    throw new Error(error.message || 'Failed to check session availability');
  }
};

module.exports = {
  reserveOrCreateSession,
  getSessions,
  getUpcomingSessions,
  getPreviousSessions,
  checkSessionAvailability, // Add this line
};
