// src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const otpController = require('../controllers/otpController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// OTP-based Phone Login Routes
router.post('/send-otp-phone', otpController.sendOTP);
router.post('/verify-otp-phone', otpController.verifyOTP);

module.exports = router;
