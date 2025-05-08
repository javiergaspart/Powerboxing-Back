const otpService = require('../services/otpService');

const otpController = {
  async sendOtpForSignup (req, res) {
    try {
      const { phone } = req.body;
      const result = await otpService.sendOtpForSignup(phone);
      return res.status(200).json(result);
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
      const { sessionId, otp } = req.body;

      // Check if sessionId or OTP is missing in the request
      if (!sessionId || !otp) {
        return res.status(400).json({
          Status: 'Failure',
          message: 'sessionId and otp are required',
        });
      }

      // Call the verifySignupOTP function to verify OTP
      const result = await otpService.verifySignupOTP(sessionId, otp);
      
      // Send response to the client
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        Status: 'Failure',
        message: error.message,
      });
    }
  }
}

module.exports = otpController;
