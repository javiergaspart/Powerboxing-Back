const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
    trainer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    available_slots: { type: Number, default: 20 },
    participants: [
        {
            boxer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            station: { type: Number, min: 1, max: 20 },
            status: { type: String, enum: ["confirmed", "pending"], default: "confirmed" }
        }
    ]
});

module.exports = mongoose.model("Session", SessionSchema);
