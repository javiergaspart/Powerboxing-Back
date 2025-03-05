const mongoose = require("mongoose");

const TrainerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "trainer" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Trainer", TrainerSchema);
