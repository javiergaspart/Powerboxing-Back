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
