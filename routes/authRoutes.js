const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const otpController = require('../controllers/otpController'); // ✅ THIS LINE FIXES THE CRASH

// ---------------- USER LOGIN / SIGNUP ----------------
router.post('/login', authController.login); // ✅ Phone-only user login
router.post('/login-trainer', authController.loginTrainer); // ✅ Trainer login

// ---------------- OTP ROUTES ----------------
router.post('/send-otp', otpController.sendOTP); // ✅ OTP for login
router.post('/verify-otp', otpController.verifyOTP); // ✅ Verify OTP for login

// ---------------- SIGNUP WITH OTP ----------------
router.post('/send-otp/signup', otpController.sendOtpForSignup); // ✅ OTP for signup
router.post('/verify-otp/signup', otpController.verifySignupOTP); // ✅ Verify OTP for signup
router.post('/register', authController.registerUser); // ✅ Final signup call after OTP

module.exports = router;
