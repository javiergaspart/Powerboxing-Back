const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const TrainerAvailability = require("../models/TrainerAvailability");
const Trainer = require("../models/Trainer");
const Session = require("../models/Session");  // ✅ Import Session Model

// ✅ Update Trainer Availability and Create Sessions
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
            trainerAvailability = new TrainerAvailability({ trainer_id, available_slots });
        } else {
            trainerAvailability.available_slots = available_slots;
        }

        // Save trainer availability
        await trainerAvailability.save();

        // ✅ Remove old sessions before adding new ones
        await Session.deleteMany({ trainer_id });

        // ✅ Create Sessions for Available Slots
        const sessions = available_slots.map(slot => ({
            trainer_id,
            date: slot.date,
            time: slot.time,
            available_slots: 20,   // Each session starts with 20 slots
            participants: []
        }));

        // ✅ Insert into MongoDB
        await Session.insertMany(sessions);

        res.status(200).json({ message: "✅ Availability and sessions updated successfully" });

    } catch (error) {
        console.error("❌ Error updating availability:", error);
        res.status(500).json({ message: "❌ Server error" });
    }
});

module.exports = router;
