const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Trainer = require("../models/Trainer"); // Ensure the Trainer model is imported
require("dotenv").config();

const router = express.Router(); // ✅ Define the router

// ✅ User & Trainer Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // 🔹 First, check if the email belongs to a User
        let user = await User.findOne({ email });

        // 🔹 If not found, check in the Trainer collection
        if (!user) {
            user = await Trainer.findOne({ email });
        }

        // 🔴 If still not found, return error
        if (!user) {
            console.log("🚫 Login Failed: Invalid Email", email);
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        // 🔹 Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("🚫 Login Failed: Incorrect Password for", email);
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        // 🔹 Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        console.log("✅ Login Success:", email);
        res.json({ token, role: user.role });
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ User Sign-Up
router.post("/signup", async (req, res) => {
    const { name, email, phone, password, role } = req.body;

    try {
        let existingUser = await User.findOne({ email });
        let existingTrainer = await Trainer.findOne({ email });

        if (existingUser || existingTrainer) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (role === "trainer") {
            const trainer = new Trainer({
                name,
                email,
                password: hashedPassword,
                role: "trainer",
            });
            await trainer.save();
            console.log("✅ Trainer Registered Successfully:", email);
        } else {
            const user = new User({
                name,
                email,
                phone,
                password: hashedPassword,
                role: "boxer",
                sessions_balance: 1,
                newcomer: true,
                join_date: new Date(),
            });
            await user.save();
            console.log("✅ User Registered Successfully:", email);
        }

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("❌ Signup Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router; // ✅ Ensure router is exported
