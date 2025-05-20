const User = require("../models/User");
const OTP = require("../models/Otp");
const jwt = require("jsonwebtoken");

// ✅ Token generation function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ✅ Send OTP
exports.sendOtpSignup = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.findOneAndUpdate(
      { phone },
      {
        phone,
        code: otpCode,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
      { upsert: true, new: true }
    );

    console.log(`[OTP DEBUG] OTP for ${phone} is ${otpCode}`);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("[SEND OTP ERROR]", err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ✅ Verify OTP
exports.verifyOtpSignup = async (req, res) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ message: "Phone and code required" });
  }

  try {
    const otpRecord = await OTP.findOne({ phone });

    if (!otpRecord || otpRecord.code !== code || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    return res.status(200).json({ message: "OTP verified" });
  } catch (err) {
    console.error("[VERIFY OTP ERROR]", err);
    return res.status(500).json({ message: "OTP verification failed" });
  }
};

// ✅ Sign-Up New User
exports.signupUser = async (req, res) => {
  const { phone, username } = req.body;

  if (!phone || !username) {
    return res.status(400).json({ message: "Phone and username required" });
  }

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
  } catch (err) {
    console.error("[SIGNUP ERROR]", err);
    return res.status(500).json({ message: "Signup failed" });
  }
};
