// src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const otpController = require('../controllers/otpController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/registerUser', authenticateToken, authController.registerUser);

// ✅ OTP Routes
router.post('/send-otp/signup', otpController.sendOtpForSignup);
router.post('/send-otp-phone', otpController.sendOTP);
router.post('/verify-otp-phone', otpController.verifyOTP);

// ✅ Fixed route to match CMD call
router.post('/verify-otp/signup', otpController.verifySignupOTPController);

module.exports = router;
