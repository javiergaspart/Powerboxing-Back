const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Session = require("../models/Session");

// Debugging: Log when routes are loaded
console.log("✅ Session Routes Loaded");

// Middleware to log all API requests
router.use((req, res, next) => {
  console.log(`🔥 [API REQUEST] ${req.method} ${req.originalUrl}`);
  console.log("🔹 Headers:", req.headers);
  console.log("🔹 Body:", req.body);
  next();
});

// Fetch sessions for a trainer
router.get("/trainer/:trainerId/sessions", async (req, res) => {
  try {
    const trainerId = req.params.trainerId;
    console.log(`📥 Fetching sessions for trainer: ${trainerId}`);

    if (!mongoose.Types.ObjectId.isValid(trainerId)) {
      console.error("❌ Invalid Trainer ID format");
      return res.status(400).json({ error: "Invalid trainer ID" });
    }

    const sessions = await Session.find({ trainer_id: trainerId });

    console.log("✅ Fetched Sessions:", JSON.stringify(sessions, null, 2));
    res.status(200).json(sessions);
  } catch (error) {
    console.error("❌ Error fetching sessions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Save sessions for a trainer
router.post("/trainer/sessions/save", async (req, res) => {
    try {
        const { trainer_id, date, time, available_slots } = req.body;

        const session = new Session({
            trainer_id,
            date,
            time,
            available_slots
        });

        await session.save();
        res.status(201).json({ message: "Session saved successfully", session });
    } catch (error) {
        console.error("❌ Error saving session:", error);
        res.status(500).json({ error: "Failed to save session" });
    }
});

module.exports = router;
