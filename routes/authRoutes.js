// routes/authRoutes.js

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const otpController = require('../controllers/otpController');

// USER login/signup
router.post('/auth/login', authController.login);
router.post('/auth/signup', authController.signup);

// TRAINER login
router.post('/auth/login-trainer', authController.loginTrainer);

// OTP
router.post('/auth/send-otp/signup', otpController.sendOTP);

module.exports = router;
