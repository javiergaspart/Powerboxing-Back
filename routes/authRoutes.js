const express = require("express");
const router = express.Router();

const {
  login,
  signup,
  trainerLogin,
  verifyOtp,
} = require("../controllers/authController");

const { sendOTP } = require("../controllers/otpController");

// ✅ USER LOGIN
router.post("/login", login);

// ✅ TRAINER LOGIN
router.post("/login-trainer", trainerLogin);

// ✅ SIGNUP (with trial session)
router.post("/signup", signup);

// ✅ OTP: Send OTP
router.post("/send-otp/signup", sendOTP);

// ✅ OTP: Verify OTP
router.post("/verify-otp/signup", verifyOtp);

module.exports = router;
