const passwordService = require('../services/passwordService');

const passwordController = {
  async changePassword(req, res) {
    const { userId, currentPassword, newPassword } = req.body;
    const result = await passwordService.changePassword(userId, currentPassword, newPassword);
    return res.status(result.success ? 200 : 400).json(result);
  },

  async sendResetOTP(req, res) {
    const { email } = req.body;
    const result = await passwordService.sendResetOTP(email);
    return res.status(result.success ? 200 : 400).json(result);
  },

  async resetPassword(req, res) {
    const { email, otp, newPassword } = req.body;
    const result = await passwordService.resetPassword(email, otp, newPassword);
    return res.status(result.success ? 200 : 400).json(result);
  }
};

module.exports = passwordController;
