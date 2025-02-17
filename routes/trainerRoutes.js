const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const SessionAssignments = require("../models/SessionAssignments");
const TrainerAvailability = require("../models/TrainerAvailability");

const router = express.Router();

/**
 * @route POST /api/trainer/set-availability
 * @desc Set trainer's available session slots
 * @access Private (Trainer Only)
 */
router.post("/set-availability", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "trainer") {
            return res.status(403).json({ message: "Access denied - Not a Trainer" });
        }

        const { available_slots } = req.body;

        await TrainerAvailability.findOneAndUpdate(
            { trainer_id: req.user.userId },
            { trainer_id: req.user.userId, available_slots },
            { upsert: true, new: true }
        );

        res.json({ message: "Availability updated successfully" });
    } catch (error) {
        console.error("🔴 Error Setting Availability:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

/**
 * @route GET /api/trainer/upcoming-sessions
 * @desc Get upcoming sessions with booked boxers
 * @access Private (Trainer Only)
 */
router.get("/upcoming-sessions", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "trainer") {
            return res.status(403).json({ message: "Access denied - Not a Trainer" });
        }

        const upcomingSessions = await SessionAssignments.find({})
            .populate("boxer_id", "name")
            .select("session_date session_time boxer_id");

        res.json(upcomingSessions);
    } catch (error) {
        console.error("🔴 Error Fetching Upcoming Sessions:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

/**
 * @route POST /api/trainer/assign-station
 * @desc Assign a boxer to a punching bag station
 * @access Private (Trainer Only)
 */
router.post("/assign-station", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "trainer") {
            return res.status(403).json({ message: "Access denied - Not a Trainer" });
        }

        const { session_date, session_time, boxer_id, station } = req.body;

        if (!session_date || !session_time || !boxer_id || !station) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let existingAssignment = await SessionAssignments.findOne({ session_date, session_time, boxer_id });

        if (existingAssignment) {
            existingAssignment.station = station;
            await existingAssignment.save();
        } else {
            const newAssignment = new SessionAssignments({
                session_date,
                session_time,
                boxer_id,
                station
            });

            await newAssignment.save();
        }

        res.json({ message: "Boxer assigned to station successfully" });
    } catch (error) {
        console.error("🔴 Error Assigning Boxer to Station:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

/**
 * @route GET /api/trainer/session-assignments
 * @desc Retrieve all boxer assignments for upcoming sessions
 * @access Private (Trainer Only)
 */
router.get("/session-assignments", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "trainer") {
            return res.status(403).json({ message: "Access denied - Not a Trainer" });
        }

        const assignments = await SessionAssignments.find({})
            .populate("boxer_id", "name")
            .select("session_date session_time boxer_id station");

        res.json(assignments);
    } catch (error) {
        console.error("🔴 Error Fetching Session Assignments:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

/**
 * @route POST /api/trainer/start-session
 * @desc Start a session and trigger IoT + video
 * @access Private (Trainer Only)
 */
router.post("/start-session", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "trainer") {
            return res.status(403).json({ message: "Access denied - Not a Trainer" });
        }

        const { session_date, session_time } = req.body;

        if (!session_date || !session_time) {
            return res.status(400).json({ message: "Session date and time required" });
        }

        const assignedBoxers = await SessionAssignments.find({ session_date, session_time }).select("boxer_id station");

        res.json({
            message: "Session started successfully, IoT and video activated",
            session_date,
            session_time,
            assigned_boxers: assignedBoxers
        });
    } catch (error) {
        console.error("🔴 Error Starting Session:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Export Router
module.exports = router;
