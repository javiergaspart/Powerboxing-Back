const mongoose = require("mongoose");

const SessionResultsSchema = new mongoose.Schema({
    boxer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    session_date: { type: String, required: true },
    session_time: { type: String, required: true },
    rounds: [
        {
            round: { type: Number, required: true },
            power: { type: Number, required: true },
            syncro: { type: Number, required: true },
            energy: { type: Number, required: true }
        }
    ],
    final_result: {
        average_power: { type: Number, required: true },
        average_syncro: { type: Number, required: true },
        final_energy: { type: Number, required: true }
    }
});

module.exports = mongoose.model("SessionResults", SessionResultsSchema);
