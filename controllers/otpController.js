const User = require("../models/User");
const OTP = require("../models/Otp");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ✅ STEP 1: Send OTP
exports.sendOtpSignup = async (req, res) => {
  const { phone, username } = req.body;

  if (!phone || !username) {
    return res.status(400).json({ message: "Phone and username required" });
  }

  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.findOneAndUpdate(
      { phone },
      {
        phone,
        code: otpCode,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min expiry
      },
      { upsert: true, new: true }
    );

    // ✅ RENDER LOG OUTPUT
    console.log("🧪 sendOtpSignup CALLED");
    console.log(`[OTP DEBUG] OTP for ${phone} is ${otpCode}`);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("[SEND OTP ERROR]", err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ✅ STEP 2: Verify OTP & Create User
exports.verifyOtpSignup = async (req, res) => {
  const { phone, code, username } = req.body;

  if (!phone || !code || !username) {
    return res.status(400).json({ message: "Phone, OTP code, and username required" });
  }

  try {
    const otpRecord = await OTP.findOne({ phone });

    if (!otpRecord || otpRecord.code !== code || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        username,
        phone,
        joinDate: new Date(),
        sessionBalance: 1,
        newcomer: true,
        type: "trial",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({ user, token });
  } catch (err) {
    console.error("[VERIFY OTP ERROR]", err);
    return res.status(500).json({ message: "OTP verification + signup failed" });
  }
};
