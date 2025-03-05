const mongoose = require("mongoose");

const SessionAssignmentSchema = new mongoose.Schema({
    boxer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    session_date: { type: String, required: true },
    session_time: { type: String, required: true },
    station: { type: Number, required: true, min: 1, max: 20 }
});

module.exports = mongoose.model("SessionAssignments", SessionAssignmentSchema);
