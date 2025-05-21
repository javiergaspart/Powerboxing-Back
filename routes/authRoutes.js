const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const otpController = require('../controllers/otpController');

// OTP
// router.post('/send-otp', otpController.sendOtpSignup);
// router.post('/verify-otp', otpController.verifyOtpSignup);

// Login
router.post('/login', authController.login);
router.post('/trainer-login', authController.trainerLogin);

module.exports = router;
