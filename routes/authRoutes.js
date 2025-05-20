const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const otpController = require("../controllers/otpController");

// ✅ Auth
router.post("/login", authController.login);

// ✅ OTP Flow
router.post("/send-otp", otpController.sendOtpSignup);
router.post("/verify-otp", otpController.verifyOtpSignup);
router.post("/signup", otpController.signupUser); // ✅ MUST be defined

module.exports = router;
