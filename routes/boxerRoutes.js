const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const SessionResults = require("../models/SessionResults");

const router = express.Router();

/**
 * @route GET /api/boxer/session-results
 * @desc Retrieve session results for a boxer
 * @access Private (Boxer Only)
 */
router.get("/session-results", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "boxer") {
            return res.status(403).json({ message: "Access denied - Not a Boxer" });
        }

        const results = await SessionResults.find({ boxer_id: req.user.userId })
            .select("session_date session_time rounds final_result");

        res.json(results);
    } catch (error) {
        console.error("🔴 Error Fetching Session Results:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Ensure this is included to export the router
module.exports = router;
