const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Trainer = require("../models/Trainer");
const Session = require("../models/Session");

// ✅ Fetch Trainer Sessions
router.get("/sessions/:trainer_id", authMiddleware, async (req, res) => {
    try {
        const { trainer_id } = req.params;
        const sessions = await Session.find({ trainer_id });

        if (!sessions || sessions.length === 0) {
            return res.status(404).json({ message: "No sessions found" });
        }

        res.status(200).json(sessions);
    } catch (error) {
        console.error("❌ Error fetching sessions:", error);
        res.status(500).json({ message: "Server error while fetching sessions" });
    }
});

// ✅ Fetch Available Sessions for User Booking
router.get("/user/sessions", authMiddleware, async (req, res) => {
    try {
        const sessions = await Session.find({ available_slots: { $gt: 0 } });

        if (!sessions || sessions.length === 0) {
            return res.status(404).json({ message: "No available sessions" });
        }

        res.status(200).json(sessions);
    } catch (error) {
        console.error("❌ Error fetching available sessions:", error);
        res.status(500).json({ message: "Server error while fetching available sessions" });
    }
});

module.exports = router;
