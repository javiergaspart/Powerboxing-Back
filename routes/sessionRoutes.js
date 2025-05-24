// routes/sessionRoutes.js
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// ✅ TEMP HOMESCREEN
router.get('/available', sessionController.getAllAvailableSessions);

// ✅ TRAINER DASHBOARD
router.get('/trainer/:trainerId/slots', sessionController.getTrainerSessions);
router.post('/trainer/:trainerId/create', sessionController.createSession);
router.post('/saveTrainerSlots', sessionController.saveTrainerSlots); // ✅ Overwrites previous
router.post('/create-multiple', sessionController.createMultipleSessions); // ✅ Appends sessions

// ✅ USER BOOKING
router.post('/book', sessionController.bookSession);

// ✅ SESSION DETAILS
router.get('/:sessionId/details', sessionController.getSessionDetails);

// ✅ USER BOOKINGS
router.get('/user/:userId/bookings', sessionController.getUserBookings);

// ✅ TEST BALANCE DECREMENT ROUTE — DIAGNOSTIC ONLY
router.post('/test-update-balance', async (req, res) => {
  try {
    const { userId } = req.body;
    const User = require('../models/User');

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    console.log(`👤 Before: ${user.username} has balance ${user.sessionBalance}`);

    user.sessionBalance -= 1;
    await user.save();

    const updatedUser = await User.findById(userId);
    console.log(`✅ After Save: balance = ${updatedUser.sessionBalance}`);

    return res.status(200).json({
      message: 'User balance updated',
      oldBalance: user.sessionBalance + 1,
      newBalance: updatedUser.sessionBalance,
    });
  } catch (err) {
    console.error('❌ Error in test-update-balance:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
