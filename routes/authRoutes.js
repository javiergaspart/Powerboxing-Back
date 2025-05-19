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
router.post("/auth/login", login);

// ✅ TRAINER LOGIN
router.post("/auth/login-trainer", trainerLogin);

// ✅ SIGNUP (with trial session)
router.post("/auth/signup", signup);

// ✅ OTP: Send OTP
router.post("/auth/send-otp/signup", sendOTP);

// ✅ OTP: Verify OTP (dummy)
router.post("/auth/verify-otp/signup", verifyOtp);

module.exports = router;
