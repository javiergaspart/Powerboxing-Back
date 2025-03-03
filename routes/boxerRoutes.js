const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

/**
 * @route GET /api/boxer/me
 * @desc Retrieve boxer details including session balance
 * @access Private (Boxer Only)
 */
router.get("/me", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "boxer") {
            return res.status(403).json({ message: "Access denied - Not a Boxer" });
        }

        const user = await User.findById(req.user.userId).select("name email sessions_balance");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("🔴 Error Fetching User Data:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

/**
 * @route POST /api/boxer/update-sessions
 * @desc Update the number of sessions for a boxer
 * @access Private (Admin or Boxer)
 */
router.post("/update-sessions", authMiddleware, async (req, res) => {
    try {
        const { userId, sessions } = req.body;

        if (!userId || sessions == null) {
            return res.status(400).json({ message: "User ID and session count required" });
        }

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.sessions_balance = sessions;
        await user.save();

        res.json({ message: "Session balance updated", sessions_balance: user.sessions_balance });
    } catch (error) {
        console.error("🔴 Error Updating Sessions:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

/**
 * @route GET /api/boxer/history
 * @desc Get the training session history for the logged-in boxer
 * @access Private (Boxer Only)
 */
router.get("/history", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "boxer") {
            return res.status(403).json({ message: "Access denied - Not a Boxer" });
        }

        const sessionHistory = await Session.find({ boxerId: req.user.userId }).sort({ date: -1 });

        if (!sessionHistory.length) {
            return res.json({ message: "No session history available", history: [] });
        }

        res.json(sessionHistory);
    } catch (error) {
        console.error("🔴 Error Fetching Session History:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
