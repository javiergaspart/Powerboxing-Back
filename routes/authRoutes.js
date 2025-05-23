const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const otpController = require('../controllers/otpController'); // ✅ Added OTP controller

// USER routes
router.post('/login', authController.userLogin);

// TRAINER login using GET and URL parameter
router.get('/trainer-login/:phone', authController.loginTrainerByPhoneParam);

// ✅ OTP Signup Routes
router.post('/send-otp/signup', otpController.sendOtpSignup);
router.post('/verify-otp/signup', otpController.verifyOtpSignup);

module.exports = router;
