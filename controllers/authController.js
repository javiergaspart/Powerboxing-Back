const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Trainer = require("../models/Trainer");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ✅ User Login
const login = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number is required" });

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = generateToken(user._id);
    return res.status(200).json({ user, token });

  } catch (error) {
    console.error("[LOGIN ERROR]", error.stack || error);
    return res.status(500).json({ message: "Login failed", error: error.message || "Unknown error" });
  }
};

// ✅ Trainer Login
const trainerLogin = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number is required" });

    const trainer = await Trainer.findOne({ phone });
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });

    const token = generateToken(trainer._id);
    return res.status(200).json({ trainer, token });

  } catch (error) {
    console.error("[TRAINER LOGIN ERROR]", error.stack || error);
    return res.status(500).json({ message: "Trainer login failed" });
  }
};

// ✅ User Signup (no email)
const signup = async (req, res) => {
  try {
    const { username, phone } = req.body;

    if (!username || !phone) {
      return res.status(400).json({ message: "Username and phone required" });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = await User.create({
      username,
      phone,
      type: "boxer",               // ✅ required for frontend routing
      sessionBalance: 1,
      isNewCustomer: true,
    });

    const token = generateToken(newUser._id);
    return res.status(201).json({ user: newUser, token });

  } catch (error) {
    console.error("[SIGNUP ERROR]", error.stack || error);
    return res.status(500).json({ message: "Signup failed" });
  }
};

// ✅ OTP Verify
const verifyOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = generateToken(user._id);
    return res.status(200).json({ user, token });

  } catch (error) {
    console.error("[OTP VERIFY ERROR]", error.stack || error);
    return res.status(500).json({ message: "OTP verification failed" });
  }
};

module.exports = {
  login,
  trainerLogin,
  signup,
  verifyOtp
};
