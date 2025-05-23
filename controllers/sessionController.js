// controllers/sessionController.js

// GET /fitboxing/sessions/available
exports.getAllAvailableSessions = (req, res) => {
  console.log("➡️ GET /fitboxing/sessions/available");
  res.status(200).json({ message: 'GET all available sessions (temp homescreen)' });
};

// GET /fitboxing/sessions/trainer/:trainerId/slots
exports.getTrainerSessions = (req, res) => {
  console.log(`➡️ GET /fitboxing/sessions/trainer/${req.params.trainerId}/slots`);
  res.status(200).json({ message: 'GET sessions created by a trainer' });
};

// POST /fitboxing/sessions/trainer/:trainerId/create
exports.createSession = (req, res) => {
  console.log(`➡️ POST /fitboxing/sessions/trainer/${req.params.trainerId}/create`);
  res.status(201).json({ message: 'POST create a session by trainer' });
};

// POST /fitboxing/sessions/book
exports.bookSession = (req, res) => {
  console.log("➡️ POST /fitboxing/sessions/book");
  res.status(200).json({ message: 'POST book a session' });
};

// GET /fitboxing/sessions/:sessionId/details
exports.getSessionDetails = (req, res) => {
  console.log(`➡️ GET /fitboxing/sessions/${req.params.sessionId}/details`);
  res.status(200).json({ message: 'GET session details by ID' });
};

// GET /fitboxing/sessions/user/:userId/bookings
exports.getUserBookings = (req, res) => {
  console.log(`➡️ GET /fitboxing/sessions/user/${req.params.userId}/bookings`);
  res.status(200).json({ message: 'GET all bookings for a user' });
};
