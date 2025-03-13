const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  trainer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // Stored as "YYYY-MM-DD"
  time: { type: String, required: true }, // Stored as "HH:mm"
  available_slots: { type: Number, default: 20, min: 0 },
  participants: [
    {
      boxer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: { type: String, default: "confirmed" }
    }
  ],
}, { timestamps: true });

const Session = mongoose.model("Session", SessionSchema);
module.exports = Session;
