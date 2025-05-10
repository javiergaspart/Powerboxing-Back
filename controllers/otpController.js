const otpService = require('../services/otpService');

const otpController = {
  async sendOTP(req, res) {
    try {
      const { phone } = req.body;

      if (!phone) {
        return res.status(400).json({ success: false, message: "Phone number is required." });
      }

      const response = await otpService.sendOTP(phone);
      return res.status(response.success ? 200 : 400).json(response);

    } catch (error) {
      console.error("Error sending OTP:", error);
      return res.status(500).json({
        success: false,
        message: 'Server error while sending OTP',
      });
    }
  },

  async verifyOTP(req, res) {
    try {
      const { phone, otp } = req.body;

      if (!phone || !otp) {
        return res.status(400).json({ success: false, message: "Phone and OTP are required." });
      }

      const response = await otpService.verifyOTP(phone, otp);
      return res.status(response.success ? 200 : 400).json(response);

    } catch (error) {
      console.error("Error verifying OTP:", error);
      return res.status(500).json({
        success: false,
        message: 'Server error while verifying OTP',
      });
    }
  }
};

module.exports = otpController;
