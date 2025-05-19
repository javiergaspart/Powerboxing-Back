const otpService = require('../services/otpService');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const otpController = {
  async sendOtpForSignup(req, res) {
    try {
      const { phone, username } = req.body;

      if (!phone || !username) {
        return res.status(400).json({ message: "Phone and full name are required." });
      }

      const result = await otpService.sendOtpForSignup(phone);
      return res.status(200).json({
        Status: result.Status,
        Details: result.Details
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  async sendOTP(req, res) {
    try {
      const { phone } = req.body;
      if (!phone) {
        return res.status(400).json({ error: "Phone number is required." });
      }

      const response = await otpService.sendOTP(phone);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async verifyOTP(req, res) {
    try {
      const { sessionId, otp, phone } = req.body;
      if (!sessionId || !otp || !phone) {
        return res.status(400).json({ error: "SessionId, OTP and phone number are required." });
      }

      const response = await otpService.verifyOTP(sessionId, otp, phone);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async verifySignupOTPController(req, res) {
    try {
      const { sessionId, otp, phone, username } = req.body;

      if (!sessionId || !otp || !phone || !username) {
        return res.status(400).json({
          Status: 'Failure',
          message: 'sessionId, otp, phone, and username are required',
        });
      }

      const result = await otpService.verifySignupOTP(sessionId, otp);

      if (result.Status !== 'Success') {
        return res.status(400).json({ Status: 'Failure', message: 'OTP verification failed' });
      }

      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res.status(200).json({
          Status: 'Success',
          message: 'OTP verified successfully, user already exists',
        });
      }

      const newUser = new User({
        username,
        phone,
        sessionBalance: 1,
        joinDate: new Date(),
        newcomer: true,
        email: `${uuidv4()}@autogen.email`
      });

      await newUser.save();

      const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;

      const payload = {
        userId: newUser._id,
        phone: newUser.phone,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

      return res.status(200).json({
        Status: 'Success',
        message: 'OTP verified and user created',
        token,
      });

    } catch (error) {
      console.error("❌ verifySignupOTP error:", error.message);
      return res.status(500).json({
        Status: 'Failure',
        message: error.message,
      });
    }
  }
};

module.exports = otpController;
