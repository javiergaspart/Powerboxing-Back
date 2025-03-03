const axios = require('axios');

// Simulated IoT API URL (Replace with actual Arduino endpoint later)
const IOT_API_URL = "http://arduino.local/api/iot";

// Function to activate leaderboard lights for 30 seconds after a round
exports.activateLeaderboardLight = async (req, res) => {
    try {
        const { session_date, session_time, round } = req.body;
        
        if (!session_date || !session_time || !round) {
            return res.status(400).json({ message: "Missing required parameters" });
        }

        console.log(`Activating leaderboard lights for Round ${round}...`);
        
        // Send request to Arduino (Simulated for now)
        await axios.post(`${IOT_API_URL}/leaderboard-light`, {
            session_date,
            session_time,
            round,
            duration: 30 // Lights ON for 30 seconds
        });

        res.json({ message: `Leaderboard lights activated for Round ${round} (30s)` });

        // Turn off after 30 seconds
        setTimeout(async () => {
            console.log(`Turning OFF leaderboard lights for Round ${round}...`);
            await axios.post(`${IOT_API_URL}/turn-off`);
        }, 30000);
    } catch (error) {
        console.error("Error activating leaderboard light:", error);
        res.status(500).json({ message: "Failed to activate leaderboard light" });
    }
};

// Function to activate final leaderboard lights for 4m 30s after Round 8
exports.activateFinalLeaderboardLight = async (req, res) => {
    try {
        const { session_date, session_time } = req.body;
        
        if (!session_date || !session_time) {
            return res.status(400).json({ message: "Missing required parameters" });
        }

        console.log("Activating final leaderboard lights for 4m 30s...");
        
        // Send request to Arduino (Simulated for now)
        await axios.post(`${IOT_API_URL}/leaderboard-light`, {
            session_date,
            session_time,
            round: "final",
            duration: 270 // Lights ON for 4m 30s
        });

        res.json({ message: "Final leaderboard lights activated for 4m 30s" });

        // Turn off after 4 minutes 30 seconds
        setTimeout(async () => {
            console.log("Turning OFF final leaderboard lights...");
            await axios.post(`${IOT_API_URL}/turn-off`);
        }, 270000);
    } catch (error) {
        console.error("Error activating final leaderboard light:", error);
        res.status(500).json({ message: "Failed to activate final leaderboard light" });
    }
};
