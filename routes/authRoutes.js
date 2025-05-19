const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const otpController = require('../controllers/otpController');
const authenticateToken = require('../middlewares/authMiddleware');

// ✅ Standard routes
router.post('/login', authController.login);
router.post('/login-trainer', authController.trainerLogin);
router.post('/signup', authController.signup);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/registerUser', authenticateToken, authController.registerUser);

// ✅ OTP routes (all defined correctly in otpController.js)
router.post('/send-otp/signup', otpController.sendOtpForSignup);
router.post('/send-otp-phone', otpController.sendOTP);
router.post('/verify-otp-phone', otpController.verifyOTP);
router.post('/verify-otp/signup', otpController.verifySignupOTPController);

module.exports = router;
