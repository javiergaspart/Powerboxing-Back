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
router.get("/api/trainer/:trainerId/sessions", async (req, res) => {
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
router.post("/api/trainer/sessions/save", async (req, res) => {
  try {
    console.log("📤 Incoming Save Request:", req.body);
    const { trainerId, sessions } = req.body;

    if (!trainerId || !mongoose.Types.ObjectId.isValid(trainerId)) {
      console.error("❌ Invalid or missing trainer_id");
      return res.status(400).json({ error: "Invalid trainer ID" });
    }
    if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
      console.error("❌ No valid sessions provided");
      return res.status(400).json({ error: "No valid sessions provided" });
    }

    console.log(`📌 Saving ${sessions.length} sessions for trainer ${trainerId}`);

    const sessionPromises = sessions.map(async (session) => {
      console.log(`➡️ Processing session:`, session);
      return Session.updateOne(
        { trainer_id: trainerId, date: session.date, time: session.time },
        { $set: { available_slots: session.available_slots || 20 } },
        { upsert: true }
      );
    });

    await Promise.all(sessionPromises);
    console.log("✅ Sessions saved successfully");
    res.status(200).json({ message: "Sessions saved successfully" });
  } catch (error) {
    console.error("❌ Error saving sessions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
