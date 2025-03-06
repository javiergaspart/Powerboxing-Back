
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

// ✅ Get available sessions (fixed filtering for string-based dates)
router.get("/available", async (req, res) => {
  try {
    let now = new Date();
    let todayDate = now.toISOString().split("T")[0]; // Extract YYYY-MM-DD as string

    console.log("🔍 Fetching sessions from:", todayDate);

    // Fetch all sessions first, then manually filter
    const allSessions = await Session.find({})
      .populate("participants.boxer_id", "name email")
      .sort("date");

    // ✅ Manually filter sessions (MongoDB struggles with string-based date filtering)
   const upcomingSessions = allSessions.filter(session => {
  return new Date(session.date) >= new Date(todayDate);
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

// ✅ Get participants for a specific session (used in Trainer Dashboard)
router.get("/:sessionId/participants", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId).populate("participants", "name email");

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({ participants: session.participants });
  } catch (error) {
    console.error("❌ Error fetching session participants:", error);
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
      session.participants.push({ boxer_id: userId, status: "confirmed" });
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

// ✅ Assign a participant to a punching bag station
router.post("/:sessionId/assign-station", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId, stationNumber } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (!session.assignments) {
      session.assignments = [];
    }

    // Check if the user is already assigned
    const existingAssignment = session.assignments.find(a => a.userId.toString() === userId);
    if (existingAssignment) {
      return res.status(400).json({ error: "User is already assigned to a station" });
    }

    session.assignments.push({ userId, stationNumber });
    await session.save();

    res.status(200).json({ message: "User assigned successfully", session });
  } catch (error) {
    console.error("❌ Error assigning user:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;