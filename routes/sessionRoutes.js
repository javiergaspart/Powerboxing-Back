const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const TrainerAvailability = require("../models/TrainerAvailability");
const Session = require("../models/Session");
const User = require("../models/User");

const router = express.Router();

/**
 * @route GET /api/sessions/available
 * @desc Fetch available sessions for boxers
 */
router.get("/available", authMiddleware, async (req, res) => {
    try {
        const availableSessions = await TrainerAvailability.find({}).populate("trainer_id", "name");
        res.json(availableSessions);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

/**
 * @route POST /api/sessions/book
 * @desc Boxer books a session
 */
router.post("/book", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "boxer") {
            return res.status(403).json({ message: "Access denied" });
        }

        const { session_id } = req.body;
        const session = await Session.findById(session_id);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        if (session.available_slots === 0) {
            return res.status(400).json({ message: "Session full" });
        }

        const boxer = await User.findById(req.user.userId);

        if (boxer.sessions_balance <= 0) {
            return res.status(400).json({ message: "Not enough session balance" });
        }

        // Book session
        session.participants.push({ boxer_id: boxer._id, status: "confirmed" });
        session.available_slots -= 1;
        await session.save();

        // Deduct session from boxer balance
        boxer.sessions_balance -= 1;
        await boxer.save();

        res.json({ message: "Session booked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

/**
 * @route POST /api/sessions/save
 * @desc Save trainer availability
 */
router.post("/save", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "trainer") {
            return res.status(403).json({ message: "Access denied" });
        }

        const { trainer_id, availability } = req.body;

        if (!trainer_id || !availability) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Store trainer availability
        const updatedAvailability = await TrainerAvailability.findOneAndUpdate(
            { trainer_id },
            { $set: { availability } },
            { upsert: true, new: true }
        );

        res.status(200).json({ message: "Availability saved successfully", updatedAvailability });
    } catch (error) {
        console.error("❌ Error saving availability:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

/**
 * @route GET /api/sessions/get
 * @desc Fetch trainer availability
 */
router.get("/get", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "trainer") {
            return res.status(403).json({ message: "Access denied" });
        }

        const trainer_id = req.user.userId;
        const availability = await TrainerAvailability.findOne({ trainer_id });

        if (!availability) {
            return res.status(404).json({ message: "No availability found" });
        }

        res.status(200).json({ availability: availability.availability });
    } catch (error) {
        console.error("❌ Error fetching availability:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;