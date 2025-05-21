const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const otpController = require("../controllers/otpController");

// ✅ Login Routes
router.post("/login", authController.login);
router.post("/trainer-login", authController.trainerLogin);

// ✅ OTP Routes
router.post("/send-otp", otpController.sendOtpSignup);
router.post("/verify-otp", otpController.verifyOtpSignup);

// ✅ Signup route — optional fallback, not used by Flutter anymore
// router.post("/signup", otpController.signupUser); ❌ Not needed unless you use a 3-step signup

module.exports = router;
