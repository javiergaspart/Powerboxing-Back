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
      const date = new Date(slotStr); // ✅ Parse ISO 8601 string directly

      return {
        trainerId,
        slot: slotStr,
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
    const sessions = await Session.find({ trainerId });

    const slots = sessions.map(session => {
      return new Date(session.slot).toISOString(); // ✅ Handle ISO format directly
    });

    return res.status(200).json(slots);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch trainer slots' });
  }
};

module.exports = {
  saveTrainerSlots,
  getTrainerSlots,
};
