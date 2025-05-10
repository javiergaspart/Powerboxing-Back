const membershipService = require('../services/membershipService');

const membershipController = {
  async buySessions(req, res) {
    try {
      const { userId, sessionsBought } = req.body;

      if (!userId || !sessionsBought) {
        return res.status(400).json({
          success: false,
          message: 'Missing userId or sessionsBought',
        });
      }

      const result = await membershipService.purchaseSessions(userId, sessionsBought);
      return res.status(result.success ? 200 : 400).json(result);

    } catch (error) {
      console.error("Error in buySessions:", error);
      return res.status(500).json({
        success: false,
        message: 'Server error while purchasing sessions',
      });
    }
  }
};

module.exports = membershipController;
