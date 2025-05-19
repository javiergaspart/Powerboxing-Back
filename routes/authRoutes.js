const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const otpController = require('../controllers/otpController'); // ✅ Now working

// ---------------- USER LOGIN / SIGNUP ----------------
router.post('/login', authController.login); // ✅ Phone-only login
router.post('/login-trainer', authController.loginTrainer); // ✅ Trainer login

// ---------------- OTP ROUTES ----------------
router.post('/send-otp', otpController.sendOTP); // ✅ OTP for login
router.post('/verify-otp', otpController.verifyOTP); // ✅ Verify OTP for login

// ---------------- SIGNUP WITH OTP ----------------
router.post('/send-otp/signup', otpController.sendOtpForSignup); // ✅ OTP for signup
router.post('/verify-otp/signup', otpController.verifySignupOTP); // ✅ FIXED function name
router.post('/register', authController.registerUser); // ✅ Final signup

module.exports = router;
