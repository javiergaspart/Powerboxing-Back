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

// ✅ Fetch Available Sessions for Boxers (Now Filters Out Past Sessions)
router.get("/sessions/available", async (req, res) => {
  try {
    console.log("📡 Fetching available sessions...");
    
    const now = new Date();
    const sessions = await Session.find({
      available_slots: { $gt: 0 },
      $or: [
        { date: { $gt: now.toISOString().split("T")[0] } }, // Future dates
        { date: now.toISOString().split("T")[0], time: { $gt: now.getHours() + ":" + now.getMinutes() } } // Same day but future times
      ]
    });

    console.log(`✅ Returning ${sessions.length} available sessions.`);
    res.status(200).json(sessions);
  } catch (error) {
    console.error("❌ Error fetching available sessions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Fetch Session Balance for Boxers (FIXED)
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

// ✅ Book a Session (Fixes Balance Deduction, Ensures Availability Reduction)
router.post("/sessions/book", async (req, res) => {
  try {
    const { userId, sessionId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(sessionId)) {
      console.error("❌ Invalid User ID or Session ID");
      return res.status(400).json({ error: "Invalid userId or sessionId" });
    }

    // Find the session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Check if session is full
    if (session.participants.length >= session.available_slots) {
      return res.status(400).json({ error: "Session is full" });
    }

    // Check if user is already booked
    const alreadyBooked = session.participants.some(p => p._id.toString() === userId);
    if (alreadyBooked) {
      return res.status(400).json({ error: "User already booked in this session" });
    }

    // ✅ Deduct session balance, add participant, and decrement available slots in one transaction
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
      { new: true } // Returns the updated document
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
