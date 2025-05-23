const mongoose = require('mongoose');
const sessionService = require('../services/sessionService');
const Session = require('../models/Session');

// ✅ Controller to save trainer availability
const saveTrainerSlots = async (req, res) => {
  try {
    const { trainerId, slots } = req.body;

    if (!trainerId || !Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields in the request body!',
      });
    }

    const sessionsToInsert = slots.map(slotStr => {
      const date = new Date(slotStr);

      // 🔥 Debug logs
      console.log("🔥 slotStr received:", slotStr);
      console.log("🔥 parsed date object:", date);

      return {
        trainerId,
        slot: date.toISOString(),
        date: date,
        createdAt: new Date(),
        availableSlots: 20,
        totalSlots: 20,
        location: "Powerboxing Studio",
      };
    });

    const result = await sessionService.insertTrainerSessions(sessionsToInsert);

    return res.status(200).json({
      success: true,
      message: 'Sessions created successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error in saveTrainerSlots:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ✅ Controller to fetch trainer slots
const getTrainerSlots = async (req, res) => {
  try {
    const trainerId = req.params.trainerId;
    const sessions = await Session.find({
      trainerId: new mongoose.Types.ObjectId(trainerId)
    });

    const slots = sessions
      .filter(session => {
        const d = new Date(session.slot);
        return d instanceof Date && !isNaN(d.getTime());
      })
      .map(session => new Date(session.slot).toISOString());

    return res.status(200).json(slots);
  } catch (error) {
    console.error('❌ Failed to fetch trainer slots:', error);
    return res.status(500).json({ error: 'Failed to fetch trainer slots' });
  }
};

// ✅ Controller to fetch all available sessions (PUBLIC)
const getAllAvailableSessions = async (req, res) => {
  try {
    const sessions = await Session.find({});
    res.status(200).json(sessions);
  } catch (error) {
    console.error("❌ Error fetching sessions:", error);
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
};

module.exports = {
  saveTrainerSlots,
  getTrainerSlots,
  getAllAvailableSessions, // ✅ Required for public route
};
