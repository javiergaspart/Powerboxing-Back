const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Trainer = require("../models/Trainer");

// USER LOGIN with phone only
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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const userData = {
      id: user._id,
      phone: user.phone,
      username: user.username,
      type: user.type || "trial",
      profileImage: user.profileImage || "",
      sessionBalance: user.sessionBalance || 1,
    };

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// TRAINER LOGIN with phone only
const loginTrainer = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const trainer = await Trainer.findOne({ phone });

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    const token = jwt.sign({ trainerId: trainer._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const trainerData = {
      id: trainer._id,
      name: trainer.name,
      phone: trainer.phone,
      email: trainer.email || `${trainer._id}@autogen.email`,
    };

    return res.status(200).json({
      message: "Trainer login successful",
      token,
      trainer: trainerData,
    });
  } catch (error) {
    console.error("Trainer login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Signup (already implemented in your existing code)
const sendOtp = require("../services/otpService").sendOtp;
const verifyOtp = require("../services/otpService").verifyOtp;

// Export all functions
module.exports = {
  login,
  loginTrainer,
  sendOtp,
  verifyOtp,
};
