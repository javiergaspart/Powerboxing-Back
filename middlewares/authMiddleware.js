// src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Assuming Bearer token

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token.' });
    }

    // Optionally, fetch the user from the database if needed
    try {
      const foundUser = await User.findById(user.id);
      if (!foundUser) {
        return res.status(404).json({ error: 'User not found.' });
      }
      req.user = foundUser; // Attach user to request
      next();
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
  });
};

module.exports = {
  authenticateToken,
};
