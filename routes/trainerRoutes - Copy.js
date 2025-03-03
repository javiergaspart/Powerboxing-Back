const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const TrainerAvailability = require("../models/TrainerAvailability");
const Trainer = require("../models/Trainer");

// ✅ Fetch Trainer Profile (Already Exists)
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.user.userId).select("-password");
        if (!trainer) {
            return res.status(404).json({ message: "❌ Trainer not found" });
        }
        res.json(trainer);
    } catch (error) {
        console.error("❌ Error fetching trainer profile:", error);
        res.status(500).json({ message: "❌ Server error" });
    }
});

/**
 * ✅ NEW: Update Trainer Availability
 * @route POST /api/trainer/availability
 */
router.post("/availability", authMiddleware, async (req, res) => {
    try {
        const { trainer_id, available_slots } = req.body;

        // Validate request
        if (!trainer_id || !available_slots || !Array.isArray(available_slots)) {
            return res.status(400).json({ message: "Invalid request data" });
        }

        // Find trainer
        const trainer = await Trainer.findById(trainer_id);
        if (!trainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }

        // Find existing availability record
        let trainerAvailability = await TrainerAvailability.findOne({ trainer_id });

        if (!trainerAvailability) {
            // If no existing record, create a new one
            trainerAvailability = new TrainerAvailability({ trainer_id, available_slots });
        } else {
            // Update existing record
            trainerAvailability.available_slots = available_slots;
        }

        // Save to MongoDB
        await trainerAvailability.save();

        res.status(200).json({ message: "✅ Availability updated successfully" });

    } catch (error) {
        console.error("❌ Error updating availability:", error);
        res.status(500).json({ message: "❌ Server error" });
    }
});

module.exports = router;
