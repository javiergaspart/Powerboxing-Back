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
    const today = new Date();
    const upcomingSessions = await Session.find({ date: { $gte: today } }).sort("date");
    res.json(upcomingSessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get upcoming session for a user
router.get("/upcoming/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const upcomingSession = await Session.findOne({ participants: userId, date: { $gte: new Date() } }).sort("date");
    res.json(upcomingSession || {});
  } catch (error) {
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
