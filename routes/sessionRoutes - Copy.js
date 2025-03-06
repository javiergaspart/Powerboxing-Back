const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const User = require("../models/User");

// ✅ Get session balance for a user
router.get("/balance/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ balance: user.sessions_balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get available sessions
router.get("/available", async (req, res) => {
  try {
    let now = new Date(); // Current date & time
    console.log("🔍 Checking sessions after:", now.toISOString());

    // Fetch all sessions
    let allSessions = await Session.find({});
    console.log("📋 All sessions in DB:", allSessions.length);

    let upcomingSessions = allSessions.filter(session => {
      if (!session.date || !session.time) return false; // Skip invalid sessions

      // Ensure `date` is formatted correctly and `time` is padded to HH:mm
      let sessionDateTimeStr = `${session.date}T${session.time.padStart(5, "0")}:00`; 
      let sessionDateTime = new Date(sessionDateTimeStr);

      console.log(`📅 Checking session: ${session.date} ${session.time} → ${sessionDateTime}`);

      return sessionDateTime > now; // Only return future sessions
    });

    console.log("✅ Found upcoming sessions:", upcomingSessions.length, "sessions");

    res.json(upcomingSessions);
  } catch (error) {
    console.error("❌ Error fetching available sessions:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get session history for a user
router.get("/history/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const history = await Session.find({ participants: userId, date: { $lt: new Date() } }).sort("-date");
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Book a session
router.post("/book", async (req, res) => {
  try {
    const { userId, sessionId } = req.body;

    if (!userId || !sessionId) {
      return res.status(400).json({ error: "Missing userId or sessionId" });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // 🔍 Check if user is already booked in this session
    if (session.participants.includes(userId)) {
      return res.status(400).json({ error: "User is already booked in this session" });
    }

    // 🔄 Reduce available slots & add user to participants
    if (session.available_slots > 0) {
      session.available_slots -= 1;
      session.participants.push(userId);
      await session.save();

      return res.status(200).json({ message: "Session booked successfully", session });
    } else {
      return res.status(400).json({ error: "No available slots" });
    }
  } catch (error) {
    console.error("❌ Error booking session:", error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
