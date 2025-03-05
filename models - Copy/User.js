const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["boxer", "trainer"], required: true },
    sessions_balance: { type: Number, default: 1 },
    join_date: { type: Date, default: Date.now },
    newcomer: { type: Boolean, default: true }
});

module.exports = mongoose.model("User", UserSchema);
