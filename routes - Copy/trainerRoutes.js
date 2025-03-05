const express = require('express');
const router = express.Router();
const Session = require('../models/Session'); // Ensure correct import

// ✅ Fetch Trainer Sessions
router.get('/sessions/:trainerId', async (req, res) => {
    try {
        const { trainerId } = req.params;
        const sessions = await Session.find({ trainer_id: trainerId }).sort({ date: 1, time: 1 });

        res.status(200).json(sessions);
    } catch (error) {
        console.error("Error fetching sessions:", error);
        res.status(500).json({ error: "Failed to fetch sessions" });
    }
});

// ✅ Save Trainer Sessions
router.post('/sessions/save', async (req, res) => {
    try {
        const { trainer_id, sessions } = req.body;

        if (!trainer_id || !sessions || sessions.length === 0) {
            return res.status(400).json({ error: "Trainer ID and sessions are required" });
        }

        await Session.deleteMany({ trainer_id }); // Remove old sessions

        const newSessions = await Session.insertMany(sessions);

        res.status(200).json({ message: "Availability saved successfully", sessions: newSessions });
    } catch (error) {
        console.error("Error saving sessions:", error);
        res.status(500).json({ error: "Failed to save sessions" });
    }
});

module.exports = router;
