const OTP = require("../models/Otp");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");

// Replace with your actual JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ✅ 1. Send OTP for Signup
exports.sendOtpSignup = async (req, res) => {
  const { phone } = req.body;

  try {
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

    await OTP.findOneAndUpdate(
      { phone },
      { otp: hashedOtp, otpExpires },
      { upsert: true, new: true }
    );

    console.log(`[OTP DEBUG] OTP for ${phone} is ${otp}`);

    // Simulate SMS sending (e.g., console, or Twilio integration here)
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("[SEND OTP ERROR]", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ✅ 2. Verify OTP for Signup (NO user check here)
exports.verifyOtpSignup = async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const otpRecord = await OTP.findOne({ phone });

    if (!otpRecord) {
      return res.status(404).json({ message: "OTP not found" });
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpRecord.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Delete OTP after successful verification
    await OTP.deleteOne({ phone });

    return res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    console.error("[VERIFY OTP ERROR]", error);
    return res.status(500).json({ message: "Server error during OTP verification" });
  }
};

// ✅ 3. Signup User (after OTP is verified)
exports.signupUser = async (req, res) => {
  const { username, phone } = req.body;

  try {
    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = new User({
      username,
      phone,
      joinDate: new Date(),
      sessionBalance: 1,
      newcomer: true,
      type: "trial",
    });

    await user.save();

    const token = generateToken(user._id);
    return res.status(201).json({ user, token });
  } catch (error) {
    console.error("[SIGNUP USER ERROR]", error);
    return res.status(500).json({ message: "Signup failed" });
  }
};
