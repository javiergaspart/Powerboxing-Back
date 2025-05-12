const User = require('../models/User');

const membershipService = {
  async purchaseSessions(userId, sessionsBought) {
    try {
      console.log(`Adding ${sessionsBought} sessions for user:`, userId);
      const user = await User.findById(userId);
      if (!user) {
        console.log('User not found');
        return { success: false, message: 'User not found' };
      }
      
      user.sessionBalance += sessionsBought;
      await user.save();
      console.log('Session balance updated successfully');
      return { success: true, message: 'Sessions added successfully', sessionBalance: user.sessionBalance };
    } catch (error) {
      console.error('Error purchasing sessions:', error);
      return { success: false, message: 'Internal server error' };
    }
  }
};

module.exports = membershipService;
