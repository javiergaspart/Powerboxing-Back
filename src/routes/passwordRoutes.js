const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');

// Change password
router.post('/change-password', passwordController.changePassword);

// Send OTP for forgot password
router.post('/send-reset-otp', passwordController.sendResetOTP);

// Reset password using OTP
router.post('/reset-password', passwordController.resetPassword);

module.exports = router;