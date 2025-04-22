const otpService = require('../services/otpService');

const otpController = {
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
      const { phone, otp } = req.body;
      if (!phone || !otp) {
        return res.status(400).json({ error: "Phone and OTP are required." });
      }

      const response = await otpService.verifyOTP(phone, otp);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
};

module.exports = otpController;
