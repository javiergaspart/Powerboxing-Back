// src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const otpController = require('../controllers/otpController');
const authenticateToken = require('../middlewares/authMiddleware');

// Email/Password routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/registerUser', authenticateToken, authController.registerUser);

// ✅ OTP-based Phone Login & Signup
router.post('/send-otp/signup', otpController.sendOtpForSignup);                   // <-- Sign up OTP
router.post('/send-otp-phone', otpController.sendOTP);                            // <-- Login OTP
router.post('/verify-otp-phone', otpController.verifyOTP);                        // <-- Login verification
router.post('/verify-otp-phone/signup', otpController.verifySignupOTPController); // <-- Signup verification

module.exports = router;
