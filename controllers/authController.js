const User = require('../models/User');
const Trainer = require('../models/Trainer');

// ---------------------------
// USER LOGIN
// ---------------------------
const userLogin = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: 'Phone number required' });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User login successful',
      user: {
        id: user._id,
        username: user.username,
        phone: user.phone,
        joinDate: user.joinDate,
        newcomer: user.newcomer,
        sessionBalance: user.sessionBalance,
        type: user.type,
      },
      token: 'mock_token'
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ---------------------------
// TRAINER LOGIN
// ---------------------------
const trainerLogin = async (req, res) => {
  try {
    console.log('[DEBUG] Received request body:', req.body); // Debug added

    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: 'Phone number required' });
    }

    const trainer = await Trainer.findOne({ phone });
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    res.status(200).json({
      message: 'Trainer login successful',
      trainer: {
        id: trainer._id,
        name: trainer.name,
        phone: trainer.phone
      }
    });
  } catch (error) {
    console.error('[TRAINER LOGIN DEBUG] Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  userLogin,
  trainerLogin
};
