const express = require("express");
const router = express.Router();
const Session = require("../models/Session");

// ✅ Get all sessions for a trainer
router.get("/trainer/:trainerId/sessions", async (req, res) => {
  try {
    const trainerId = req.params.trainerId;
    if (!trainerId) {
      return res.status(400).json({ error: "Trainer ID is required" });
    }

    const sessions = await Session.find({ trainer_id: trainerId }).sort({ date: 1, time: 1 });

    res.json(sessions);
  } catch (error) {
    console.error("❌ Error fetching trainer sessions:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Save trainer availability
router.post("/trainer/sessions/save", async (req, res) => {
  try {
    const { trainerId, date, times } = req.body;

    if (!trainerId || !date || !times || !Array.isArray(times) || times.length === 0) {
      return res.status(400).json({ error: "Trainer ID, date, and sessions are required" });
    }

    const newSessions = times.map((time) => ({
      trainer_id: trainerId,
      date,
      time,
      available_slots: 20,
      participants: [],
    }));

    await Session.insertMany(newSessions);

    res.status(200).json({ message: "Availability saved successfully" });
  } catch (error) {
    console.error("❌ Error saving trainer availability:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get all sessions for a boxer
router.get("/boxer/:boxerId/sessions", async (req, res) => {
  try {
    const boxerId = req.params.boxerId;
    if (!boxerId) {
      return res.status(400).json({ error: "Boxer ID is required" });
    }

    const sessions = await Session.find({ "participants.boxer_id": boxerId }).sort({ date: 1, time: 1 });

    res.json(sessions);
  } catch (error) {
    console.error("❌ Error fetching boxer sessions:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Book a session for a boxer
router.post("/boxer/sessions/book", async (req, res) => {
  try {
    const { sessionId, boxerId } = req.body;

    if (!sessionId || !boxerId) {
      return res.status(400).json({ error: "Session ID and Boxer ID are required" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.available_slots <= 0) {
      return res.status(400).json({ error: "No available slots left for this session" });
    }

    session.participants.push({ boxer_id: boxerId, status: "confirmed" });
    session.available_slots -= 1;
    await session.save();

    res.status(200).json({ message: "Session booked successfully" });
  } catch (error) {
    console.error("❌ Error booking session:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
