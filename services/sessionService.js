const Session = require('../models/Session');

const getSessionDetails = async (sessionId) => {
  return await Session.findById(sessionId);
};

const reserveOrCreateSession = async (trainerId, dateTime) => {
  // Your original logic here (preserved)
};

const getSessions = async () => {
  return await Session.find({});
};

const getUpcomingSessions = async (trainerId, date) => {
  // Your original logic
};

const getPreviousSessions = async (trainerId, date) => {
  // Your original logic
};

const checkSessionAvailability = async (sessionId) => {
  // Your original logic
};

const updateSessionBalance = async (userId, delta) => {
  // Your original logic
};

const saveTrainerSlots = async (trainerId, slots) => {
  // Your original logic
};

const getAvailableSessionsForDate = async (date) => {
  // Your original logic
};

const deleteSessionByDateTime = async (slot) => {
  return await Session.deleteOne({ slot });
};

const getSessionsByTrainer = async (trainerId) => {
  return await Session.find({ trainerId });
};

const fetchAllSlotsByDate = async (date) => {
  // Your original logic
};

const mapUsersToPunchingBags = async (sessionId, userBagMap) => {
  // Your original logic
};

// ✅ FIXED FUNCTION — now adds required schema fields
const insertTrainerSessions = async (sessions) => {
  const enrichedSessions = sessions.map(session => {
    const [datePart] = session.slot.split(':');
    return {
      ...session,
      totalSlots: 18,
      availableSlots: 18,
      location: 'Powerboxing Studio',
      date: datePart, // format: YYYY.MM.DD
    };
  });

  return await Session.insertMany(enrichedSessions);
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
  fetchAllSlotsByDate,
  mapUsersToPunchingBags,
  insertTrainerSessions, // ✅ included in export
};
