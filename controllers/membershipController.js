const membershipService = require('../services/membershipService');

const membershipController = {
  async buySessions(req, res) {
    const { userId, sessionsBought } = req.body;
    if (!userId || !sessionsBought) {
      return res.status(400).json({ success: false, message: 'Missing userId or sessionsBought' });
    }
    const response = await membershipService.purchaseSessions(userId, sessionsBought);
    res.status(response.success ? 200 : 400).json(response);
  }
};

module.exports = membershipController;