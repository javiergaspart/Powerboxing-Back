// src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const otpController = require('../controllers/otpController');
const authenticateToken = require('../middlewares/authMiddleware');

// ✅ AUTH CONTROLLER ROUTES
router.post('/register', authController.register);  // optional
router.post('/login', authController.login);  // user login
router.post('/login-trainer', authController.trainerLogin);  // trainer login
router.post('/signup', authController.signup);  // user signup
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/registerUser', authenticateToken, authController.registerUser);

// ✅ OTP CONTROLLER ROUTES
router.post('/send-otp/signup', otpController.sendOtpForSignup); // OTP for signup
router.post('/send-otp-phone', otpController.sendOTP);           // General OTP
router.post('/verify-otp-phone', otpController.verifyOTP);       // General OTP verification
router.post('/verify-otp/signup', otpController.verifySignupOTPController); // Verify OTP for signup

module.exports = router;
