const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const otpController = require('../controllers/otpController');

// -------- AUTH ROUTES -------- //
router.post('/register', authController.registerUser);            // Register user with phone/username
router.post('/login', authController.login);                      // Login user (phone-based login)
router.post('/forgot-password', authController.forgotPassword);   // Optional
router.post('/reset-password', authController.resetPassword);     // Optional

// -------- OTP ROUTES -------- //
router.post('/send-otp', otpController.sendOTP);                         // Send OTP (for login)
router.post('/verify-otp', otpController.verifyOTP);                     // Verify OTP (for login)
router.post('/send-otp/signup', otpController.sendOtpForSignup);        // Send OTP (for signup)
router.post('/verify-otp/signup', otpController.verifySignupOTPController); // Verify OTP (signup)

module.exports = router;
