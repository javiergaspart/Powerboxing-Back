const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Session = require("../models/Session");
const User = require("../models/User");

// Debugging: Log when routes are loaded
console.log("✅ Session Routes Loaded");

// Middleware to log all API requests
router.use((req, res, next) => {
  console.log(`🔥 [API REQUEST] ${req.method} ${req.originalUrl}`);
  console.log("🔹 Headers:", req.headers);
  console.log("🔹 Body:", req.body);
  next();
});

// ✅ Fetch Sessions for Trainer (Restored from Copy 6)
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
        const sessions = req.body;

        if (!Array.isArray(sessions) || sessions.length === 0) {
            return res.status(400).json({ error: "Invalid session data" });
        }

        // Validate each session object
        for (const session of sessions) {
            if (!session.trainer_id || !session.date || !session.time || session.available_slots == null) {
                return res.status(400).json({ error: "Missing required fields in one or more sessions" });
            }

            // Validate Date Format (YYYY-MM-DD)
            if (!/^\d{4}-\d{2}-\d{2}$/.test(session.date)) {
                return res.status(400).json({ error: `Invalid date format: ${session.date}` });
            }

            // Validate Time Format (HH:MM)
            if (!/^\d{2}:\d{2}$/.test(session.time)) {
                return res.status(400).json({ error: `Invalid time format: ${session.time}` });
            }
        }

        // Save all valid sessions
        await Session.insertMany(sessions);

        res.status(201).json({ message: "Sessions saved successfully" });
    } catch (error) {
        console.error("❌ Error saving sessions:", error);
        res.status(500).json({ error: "Failed to save sessions" });
    }
});

// ✅ Fetch Available Sessions for Boxers
router.get("/sessions/available", async (req, res) => {
  try {
    console.log("📡 Fetching available sessions...");
    
    const now = new Date();
    const sessions = await Session.find({
      available_slots: { $gt: 0 },
      $or: [
        { date: { $gt: now.toISOString().split("T")[0] } },
        { date: now.toISOString().split("T")[0], time: { $gt: now.getHours() + ":" + now.getMinutes() } }
      ]
    });

    console.log(`✅ Returning ${sessions.length} available sessions.`);
    res.status(200).json(sessions);
  } catch (error) {
    console.error("❌ Error fetching available sessions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Fetch Session Balance for Boxers
router.get("/sessions/balance/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(`📡 Fetching session balance for user: ${userId}`);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("❌ Invalid User ID format:", userId);
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ User found. Session Balance:", user.sessions_balance);
    res.json({ balance: user.sessions_balance ?? 0 });
  } catch (error) {
    console.error("❌ Error fetching session balance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Book a Session
router.post("/sessions/book", async (req, res) => {
  try {
    const { userId, sessionId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(sessionId)) {
      console.error("❌ Invalid User ID or Session ID");
      return res.status(400).json({ error: "Invalid userId or sessionId" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.participants.length >= session.available_slots) {
      return res.status(400).json({ error: "Session is full" });
    }

    const alreadyBooked = session.participants.some(p => p._id.toString() === userId);
    if (alreadyBooked) {
      return res.status(400).json({ error: "User already booked in this session" });
    }

    const user = await User.findById(userId);
    if (!user || user.sessions_balance <= 0) {
      return res.status(400).json({ error: "Insufficient session balance" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { $inc: { sessions_balance: -1 } }, { new: true });
    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      { 
        $push: { participants: { _id: userId, status: "confirmed" } },
        $inc: { available_slots: -1 }
      },
      { new: true }
    );

    console.log("✅ Updated session:", updatedSession);
    console.log("✅ Updated user balance:", updatedUser.sessions_balance);
    res.status(200).json({ message: "Session booked successfully", updatedSession, updatedUser });
  } catch (error) {
    console.error("❌ Error booking session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
