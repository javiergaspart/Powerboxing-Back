const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const SessionResults = require("../models/SessionResults");

// 🏆 GET Live Leaderboard (For a specific round)
router.get("/live/:session_date/:session_time/:round", authenticateToken, async (req, res) => {
    try {
        const { session_date, session_time, round } = req.params;

        // Fetch results for the given session, time, and round
        const roundResults = await SessionResults.find({
            session_date,
            session_time,
            "rounds.round": parseInt(round)
        })
        .populate("boxer_id", "name") // Get boxer names
        .exec();

        if (!roundResults || roundResults.length === 0) {
            return res.status(404).json({ message: "No results found for this round." });
        }

        // Extract the round-specific scores and sort by Energy Score (Power × Syncro)
        let leaderboard = roundResults.map(session => {
            const roundData = session.rounds.find(r => r.round === parseInt(round));
            return {
                boxer_id: session.boxer_id._id,
                boxer_name: session.boxer_id.name,
                round: parseInt(round),
                energy: roundData.energy
            };
        });

        // Sort by Energy Score (highest first)
        leaderboard.sort((a, b) => b.energy - a.energy);

        // Add ranking
        leaderboard = leaderboard.map((entry, index) => ({
            rank: index + 1,
            ...entry
        }));

        res.json({
            session_date,
            session_time,
            round: parseInt(round),
            leaderboard
        });

    } catch (error) {
        console.error("❌ Error fetching live leaderboard:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// 🏆 GET Final Leaderboard (After 8 Rounds)
router.get("/final/:session_date/:session_time", authenticateToken, async (req, res) => {
    try {
        const { session_date, session_time } = req.params;

        // Get all session results for the specified date/time
        const sessionResults = await SessionResults.find({ session_date, session_time })
            .populate("boxer_id", "name") // Get boxer's name
            .exec();

        if (!sessionResults || sessionResults.length === 0) {
            return res.status(404).json({ message: "No results found for this session." });
        }

        // Compute the final leaderboard based on average energy across 8 rounds
        let finalLeaderboard = sessionResults.map(session => ({
            boxer_id: session.boxer_id._id,
            boxer_name: session.boxer_id.name,
            average_energy: session.final_result.final_energy // Stored after round 8
        }));

        // Sort by average energy (highest first)
        finalLeaderboard.sort((a, b) => b.average_energy - a.average_energy);

        // Add ranking
        finalLeaderboard = finalLeaderboard.map((entry, index) => ({
            rank: index + 1,
            ...entry
        }));

        res.json({
            session_date,
            session_time,
            finalLeaderboard
        });

    } catch (error) {
        console.error("❌ Error fetching final leaderboard:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
