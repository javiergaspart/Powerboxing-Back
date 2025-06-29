const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const Session = require('../models/Session'); // ✅ required for temporary delete route

// ✅ Save trainer availability and create sessions
router.post('/saveTrainerSlots', sessionController.saveTrainerSlots);

// ✅ Fetch all slots created by this trainer
router.get('/trainer/:trainerId/slots', sessionController.getTrainerSlots);

// ✅ Assign stations to participants for a session
router.post('/assign-stations', sessionController.assignStations);

// ✅ Fetch all sessions for a trainer with populated participant usernames
router.get('/sessions', sessionController.getTrainerSessions);

// ✅ TEMPORARY: Delete all sessions
router.delete('/delete-all', async (req, res) => {
  try {
    const result = await Session.deleteMany({});
    res.status(200).json({ message: 'All sessions deleted', deletedCount: result.deletedCount });
  } catch (err) {
    console.error('❌ Error deleting sessions:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
