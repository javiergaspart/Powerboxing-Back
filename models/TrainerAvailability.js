const mongoose = require("mongoose");

const TrainerAvailabilitySchema = new mongoose.Schema({
    trainer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    available_slots: [
        {
            date: { type: String, required: true },
            time: { type: String, required: true },
            status: { type: String, enum: ["available", "booked"], default: "available" }
        }
    ]
});

module.exports = mongoose.model("TrainerAvailability", TrainerAvailabilitySchema);
