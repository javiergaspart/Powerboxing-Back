// src/services/sessionService.js

const Session = require('../models/Session');
const mongoose = require('mongoose'); // Import mongoose
const User = require('../models/User'); 
const Trainer = require('../models/Trainer');

// Create a new session
const reserveOrCreateSession = async (req, res) => {
  console.log("Request received:", req);

  const { userId, slotTiming, location, date, totalSlots, time } = req;
  console.log("Checking session for slotTiming:", slotTiming, "Location:", location, "Date:", date);

  const normalizedSlotTimings = slotTiming.replace(/\s/g, ' ').trim();
  const normalizedLocation = location.trim();
  const normalizedDate = new Date(date); // Ensure correct date format

  try {
    // Check if a session with the same slot timings, location, and date exists
    console.log("Searching for session with:", { slotTiming: normalizedSlotTimings, location: normalizedLocation, date: normalizedDate });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check session balance before proceeding
    if (user.sessionBalance < 1) {
      return res.status(400).json({ message: "Session Balance not Available!" });
    }

    let session = await Session.findOne({ slotTiming: normalizedSlotTimings, date: normalizedDate });

    console.log("Session found:", session);

    if (!session) {
      console.log('Session doesnt exists:');
      return res.status(400).json({ message: 'Session doesnt exists' });

    }

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
    session.availableSlots -= 1;

    console.log("Saving session after adding user:", session.bookedUsers);
    await session.save();

    console.log("Session saved!");

    console.log(session);

    user.sessionBalance -= 1;
    await user.save();

    console.log("Printing user");
    console.log(user);

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


const getUpcomingSessions = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid User ID format" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const currentTime = new Date();

    // Fetch sessions from today onward (broad match)
    const sessions = await Session.find({
      bookedUsers: userObjectId,
      date: { $gte: new Date(currentTime.toDateString()) }
    })
      .populate('bookedUsers', 'username')
      .populate('punchingBags')
      .sort({ date: 1 });

    // Filter only those in the future based on date + slotTiming
    const upcomingSessions = sessions.filter(session => {
      const sessionDateTime = getCombinedDateTime(session.date, session.slotTiming);
      return sessionDateTime > currentTime;
    });

    const updatedSessions = upcomingSessions.map(session => ({
      ...session.toObject(),
      isCompleted: false,
    }));

    res.status(200).json({
      success: true,
      data: updatedSessions,
    });

  } catch (error) {
    console.error('Error fetching user sessions:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


// Helper function to convert current time to slot format (e.g., '5:00 PM')
function getCurrentTimeSlotString(date = new Date()) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert 0 => 12
  const minuteStr = minutes.toString().padStart(2, '0');
  return `${hours}:${minuteStr} ${ampm}`;
}


// Get previous sessions for a user

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
const deleteSessionByDateTime = async (trainerId, date, time) => {
  try {
    const result = await Session.findOneAndDelete({
      trainerId,
      date: new Date(date),
      slotTiming: time, // e.g., "10:30 AM"
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
    // if (now.toDateString() === inputDate.toDateString()) {
    //   // If today, set startTime to the current time
    //   startTime = now;
    //   console.log('Today’s date matched. Fetching sessions after current time:', now.toISOString());
    // } else {
    //   console.log('Fetching sessions for the entire day:', startOfDay.toISOString(), 'to', endOfDay.toISOString());
    // }

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


const fetchAllSlotsByDate = async (date) => {
  const selectedDate = new Date(date);
  const nextDate = new Date(selectedDate);
  nextDate.setDate(selectedDate.getDate() + 1);

  const sessions = await Session.find({
    date: {
      $gte: selectedDate,
      $lt: nextDate,
    },
  })
  .sort({ slotTiming: 1 })
  .populate('trainerId', 'name email') // Optional: populate trainer info
  .lean();

  return sessions;
};

const getSessionDetails = async (sessionId) => {
  try {
    const session = await Session.findById(sessionId)
      .populate('trainerId', 'name') // Populate trainer info if needed
      .populate('bookedUsers', 'username') // Populate users if needed
      .populate('punchingBags', 'bagName'); // Populate punching bags if needed
    if (!session) {
      throw new Error('Session not found');
    }
    return session;
  } catch (error) {
    throw new Error(error.message);
  }
};

const mapUsersToPunchingBags = async (sessionId, mappings) => {
  const session = await Session.findById(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }

  // Validate format
  const isValid = mappings.every(m => m.userId && m.punchingBagId);
  if (!isValid) {
    throw new Error('Invalid mapping data');
  }

  session.userBagMapping = mappings;
  await session.save();
  return session;
};

const getPreviousSessions = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid User ID format" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const currentTime = new Date();

    // Get all sessions up to today
    const sessions = await Session.find({
      bookedUsers: userObjectId,
      date: { $lte: new Date(currentTime.toDateString()) } // <= today
    })
      .populate('bookedUsers', 'username')
      .populate('punchingBags');

    const previousSessions = sessions.filter(session => {
      const sessionDateTime = getCombinedDateTime(session.date, session.slotTiming);
      return sessionDateTime < currentTime;
    });

    const updatedSessions = previousSessions.map(session => ({
      ...session.toObject(),
      isCompleted: true,
    }));

    res.status(200).json({
      success: true,
      data: updatedSessions,
    });
  } catch (error) {
    console.error('Error fetching previous sessions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Combine date and slotTiming into a full Date object
function getCombinedDateTime(dateObj, timeStr) {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  const fullDate = new Date(dateObj);
  fullDate.setHours(hours, minutes, 0, 0);

  return fullDate;
}


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
  fetchAllSlotsByDate,
  mapUsersToPunchingBags,
};
