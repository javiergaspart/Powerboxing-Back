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
    let now = new Date(); // Current timestamp
    console.log("🔍 Checking today's datetime:", now.toISOString());

    // Fetch all sessions
    let allSessions = await Session.find({});
    console.log("📋 All sessions in DB before filtering:", allSessions.length);

    let upcomingSessions = allSessions.filter(session => {
      if (!session.date || !session.time) return false; // Skip invalid entries

      // Ensure proper format for DateTime conversion
      let sessionDateTimeStr = `${session.date} ${session.time}`;
      let sessionDateTime = new Date(sessionDateTimeStr.replace(/-/g, "/")); // Fix format issue

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
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const user = await User.findById(userId);
    if (user.sessions_balance <= 0) {
      return res.status(400).json({ message: "Not enough session balance" });
    }

    user.sessions_balance -= 1;
    await user.save();
    session.participants.push(userId);
    await session.save();

    res.json({ message: "Session booked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
