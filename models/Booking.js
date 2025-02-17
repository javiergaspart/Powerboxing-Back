const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    boxer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    session_date: { type: String, required: true },
    session_time: { type: String, required: true },
    status: { type: String, default: "booked" },
});

module.exports = mongoose.model("Booking", BookingSchema);
