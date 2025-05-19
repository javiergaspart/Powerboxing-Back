const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const otpController = require('../controllers/otpController'); // ✅ THIS MUST EXIST

// ✅ Ensure these functions exist in your controller files!
router.post('/auth/login', authController.login);
router.post('/auth/signup', authController.signup);
router.post('/auth/login-trainer', authController.loginTrainer);
router.post('/auth/send-otp/signup', otpController.sendOTP); // ✅ This line causes crash if undefined

module.exports = router;
