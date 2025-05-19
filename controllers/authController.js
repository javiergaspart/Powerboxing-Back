const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Trainer = require("../models/Trainer");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ✅ 1. User Login
const login = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = generateToken(user._id);
    return res.status(200).json({ user, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

// ✅ 2. Trainer Login
const trainerLogin = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const trainer = await Trainer.findOne({ phone });
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    const token = generateToken(trainer._id);
    return res.status(200).json({ trainer, token });
  } catch (error) {
    console.error("Trainer login error:", error);
    res.status(500).json({ message: "Trainer login failed" });
  }
};

// ✅ 3. Signup (Create trial user)
const signup = async (req, res) => {
  try {
    const { username, phone } = req.body;

    if (!username || !phone) {
      return res.status(400).json({ message: "Username and phone required" });
    }

    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      username,
      phone,
      type: "trial",
      sessionBalance: 1,
      isNewCustomer: true,
    });

    const token = generateToken(newUser._id);
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed" });
  }
};

// ✅ 4. OTP Verify (for signup)
const verifyOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = generateToken(user._id);
    res.status(200).json({ user, token });
  } catch (error) {
    console.error("OTP verify error:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// ✅ EXPORT ALL FUNCTIONS
module.exports = {
  login,
  trainerLogin,
  signup,
  verifyOtp,
};
