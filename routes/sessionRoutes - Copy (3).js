const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Session = require("../models/Session");

router.post("/save", async (req, res) => {
  try {
    const { trainer_id, sessions } = req.body;

    if (!trainer_id) {
      console.error("🚨 ERROR: trainer_id is missing in request!");
      return res.status(400).json({ error: "trainer_id is missing" });
    }

    if (!mongoose.Types.ObjectId.isValid(trainer_id)) {
      console.error("🚨 ERROR: Invalid ObjectId format for trainer_id:", trainer_id);
      return res.status(400).json({ error: "Invalid ObjectId format for trainer_id" });
    }

    // Convert trainer_id to ObjectId
    const trainerObjectId = new mongoose.Types.ObjectId(trainer_id);
    console.log("✅ Converted trainer_id to ObjectId:", trainerObjectId);

    if (!sessions || !Array.isArray(sessions)) {
      console.error("🚨 ERROR: Sessions array is missing or invalid!");
      return res.status(400).json({ error: "Invalid sessions array" });
    }

    // Ensure each session explicitly includes trainer_id
    const newSessions = sessions.map(session => ({
      ...session,
      trainer_id: trainerObjectId  // ✅ Ensure trainer_id is stored as ObjectId
    }));

    console.log("✅ Final Sessions Data Before Insert:", newSessions);

    // Remove old trainer sessions and insert new ones
    await Session.deleteMany({ trainer_id: trainerObjectId });
    const insertedSessions = await Session.insertMany(newSessions);

    res.status(200).json({ message: "✅ Sessions saved successfully", sessions: insertedSessions });
  } catch (error) {
    console.error("❌ Error saving trainer sessions:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get all available sessions
router.get("/", async (req, res) => {
  try {
    const sessions = await Session.find({}).lean();
sessions.forEach(session => {
  session.available_slots = parseInt(session.available_slots, 10) || 0; // ✅ Force available_slots to be an int
});
    res.json(sessions);
  } catch (error) {
    console.error("❌ Error fetching sessions:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
