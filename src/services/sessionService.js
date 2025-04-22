// src/services/sessionService.js

const Session = require('../models/Session');
const mongoose = require('mongoose'); // Import mongoose
const User = require('../models/User'); 
const Trainer = require('../models/Trainer');

// Fetch session details by session ID
const getSessionDetails = async (sessionId) => {
  try {
    // Find session by ID and populate relevant fields (like trainer, booked users, punching bags)
    const session = await Session.findById(sessionId)
      .populate('trainerId') // Populate trainer details
      .populate('bookedUsers') // Populate booked users details
      .populate('punchingBags'); // Populate punching bags details
    
    if (!session) {
      throw new Error('Session not found');
    }

    return session;
  } catch (error) {
    throw error;
  }
};

// Create a new session
const reserveOrCreateSession = async (req, res) => {
  console.log("Request received:", req.body);

  const { userId, slotTimings, location, date, totalSlots, time } = req;
  console.log("Checking session for slotTimings:", slotTimings, "Location:", location, "Date:", date);

  const normalizedSlotTimings = slotTimings.replace(/\s/g, ' ').trim();
  const normalizedLocation = location.trim();
  const normalizedDate = new Date(date); // Ensure correct date format

  try {
    // Check if a session with the same slot timings, location, and date exists
    console.log("Searching for session with:", { slotTimings: normalizedSlotTimings, location: normalizedLocation, date: normalizedDate });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check session balance before proceeding
    if (user.sessionBalance < 1) {
      return res.status(400).json({ message: "Session Balance not Available!" });
    }

    let session = await Session.findOne({ slotTimings: normalizedSlotTimings, location: normalizedLocation, date: normalizedDate });

    console.log("Session found:", session);

    if (session) {
      console.log('Session already exists:', session);

      // If the user is already booked, return an error
      if (session.bookedUsers.includes(userId)) {
        return res.status(400).json({ message: 'User already reserved this session' });
      }

      // Check if slots are available
      if (session.bookedUsers.length >= session.totalSlots) {
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
      totalSlots: totalSlots || 10, // Default to 10 slots if not provided
      availableSlots: totalSlots || 10, // Initially, available slots = total slots
      time: time
    });

    await session.save();

    user.sessionBalance -= 1;
    await user.save();

    return res.status(200).json({ 
      message: 'Reservation successful', 
      session,
      newBalance: user.sessionBalance  // Return updated balance
    });
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
    const currentTime = new Date();

    // Find sessions where the user is part of bookedUsers and sort by date
    const sessions = await Session.find({
      date: { $gt: currentTime }, 
      bookedUsers: userObjectId,
    }).populate('bookedUsers', 'username')
      .populate('punchingBags')
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
    
    const currentTime = new Date();

    // Find previous sessions where date is less than current time
    const sessions = await Session.find({
      date: { $lt: currentTime },  // <-- Now filtering by time, not just date
      bookedUsers: userObjectId,
    })
      .populate('bookedUsers', 'username')
      .populate('punchingBags')
      .sort({ date: -1 });

      
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

// Function to update session balance
const updateSessionBalance = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (user.sessionBalance < 1) {
      return { success: false, message: "Session Balance not Available!" };
    }

    user.sessionBalance -= 1;
    await user.save();

    return { success: true, message: "Session balance updated successfully", newBalance: user.sessionBalance };
  } catch (error) {
    console.error("Error updating session balance:", error);
    return { success: false, message: "Internal server error" };
  }
};

//save slots defined by trainers
const saveTrainerSlots = async (data) => {
  try {
    const { date, location, trainerId, slotTimings } = data;

    console.log('📩 Incoming request to saveTrainerSlots...');
    console.log('🗓️  Date:', date);
    console.log('📍 Location:', location);
    console.log('👤 Trainer ID:', trainerId);
    console.log('⏱️  Raw Slot Timings:', slotTimings);

    // Validate trainer
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      console.error('❌ Trainer not found with ID:', trainerId);
      throw new Error('Trainer not found');
    }

    const createdSessions = [];

    for (const slot of slotTimings) {
      const sanitizedSlot = slot.replace(/\u202F|\u00A0/g, ' ').trim(); // removes non-breaking spaces & trims
      console.log(`🧼 Sanitized slot: "${sanitizedSlot}" (original: "${slot}")`);
      console.log(`🔢 Code units:`, Array.from(sanitizedSlot).map(char => char.charCodeAt(0)));

      // Check if the session already exists for this date and slot
      const existingSession = await Session.findOne({ date, slotTiming: sanitizedSlot, trainerId });
      if (existingSession) {
        console.log(`❌ Session for ${sanitizedSlot} on ${date} already exists. Skipping save.`);
        continue;  // Skip this slot and move to the next one
      }
      
      const session = new Session({
        date,
        slotTiming: sanitizedSlot,
        location,
        trainerId,
        instructor: trainer.name,
        availableSlots: 10,
        totalSlots: 10,
      });

      await session.save();
      console.log(`✅ Saved session for ${sanitizedSlot} on ${date}`);
      createdSessions.push(session);
    }

    console.log('🎉 All sessions created successfully!');
    return createdSessions;
  } catch (error) {
    console.error('🔥 Error in saveTrainerSlots:', error);
    throw new Error('Error saving trainer slots: ' + error.message);
  }
};


// Helper function to format current time to match session format
const formatTime = (date) => {
  return date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

// Service to get available sessions for a specific date from current time onwards
const getAvailableSessionsForDate = async (date) => {
  const currentTime = formatTime(new Date()); // Get current time in "HH:mm AM/PM" format

  // Convert date to start and end of the day to handle all timezones
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  // Fetch sessions for the given date where availableSlots > 0 and session time >= current time
  return await Session.find({
    date: { $gte: dayStart, $lte: dayEnd },
    availableSlots: { $gt: 0 },
    slotTiming: { $gte: currentTime }, // Only fetch sessions after the current time
  }).sort({ slotTiming: 1 }); // Sorting by time
};

// Service function for deleting a session
const deleteSessionByDateTime = async (trainerId, dateTime) => {
  try {
    const result = await Session.findOneAndDelete({
      trainerId,
      dateTime: new Date(dateTime),
    });

    if (!result) {
      throw new Error('Session not found for the provided trainer and dateTime.');
    }

    return result;
  } catch (error) {
    throw new Error('Error deleting session: ' + error.message);
  }
};

const getSessionsByTrainer = async (trainerId, date) => {
  try {
    console.log('Fetching sessions for trainer:', trainerId);
    console.log('Input date received:', date);

    const now = new Date(); // Current time
    const inputDate = new Date(date); // Parse the input date

    // Set the start of the day for the given date (00:00:00)
    const startOfDay = new Date(inputDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(inputDate.setHours(23, 59, 59, 999));

    console.log('Start of the day:', startOfDay.toISOString());
    console.log('End of the day:', endOfDay.toISOString());

    // If the provided date is today, only fetch sessions after the current time
    let startTime = startOfDay;
    if (now.toDateString() === inputDate.toDateString()) {
      // If today, set startTime to the current time
      startTime = now;
      console.log('Today’s date matched. Fetching sessions after current time:', now.toISOString());
    } else {
      console.log('Fetching sessions for the entire day:', startOfDay.toISOString(), 'to', endOfDay.toISOString());
    }

    // Fetch sessions for the trainer within the calculated date range
    const sessions = await Session.find({
      trainerId,
      date: { $gte: startTime, $lte: endOfDay }, // Sessions based on the date field
    });

    console.log('Fetched sessions:', sessions);

    return sessions;
  } catch (error) {
    console.error('❌ Error in getSessionsByTrainer:', error);
    throw new Error('Error fetching sessions for trainer');
  }
};

const getPastSessionsByTrainer = async (trainerId, date) => {
  try {
    const now = new Date(); // Current time
    const inputDate = new Date(date); // Parse the input date

    // Set the start of the day for the given date (00:00:00)
    const startOfDay = new Date(inputDate.setHours(0, 0, 0, 0));

    // Set the end of the day for the given date (23:59:59.999)
    const endOfDay = new Date(inputDate.setHours(23, 59, 59, 999));

    // If the provided date is today, only fetch sessions before the current time
    let endTime = endOfDay;
    if (now.toDateString() === inputDate.toDateString()) {
      // If today, set endTime to the current time
      endTime = now;
    }

    // Fetch sessions for the trainer within the calculated date range
    const sessions = await Session.find({
      trainerId,
      dateTime: { $gte: startOfDay, $lte: endTime }, // Sessions before current time for today, or all sessions for previous days
    });

    return sessions;
  } catch (error) {
    console.error('❌ Error in getPastSessionsByTrainer:', error);
    throw new Error('Error fetching past sessions for trainer');
  }
};


module.exports = {
  getSessionDetails,
  reserveOrCreateSession,
  getSessions,
  getUpcomingSessions,
  getPreviousSessions,
  checkSessionAvailability, 
  updateSessionBalance,
  saveTrainerSlots,
  getAvailableSessionsForDate,
  deleteSessionByDateTime,
  getSessionsByTrainer,
  getPastSessionsByTrainer,
};
