const User = require('../models/User');
const Trainer = require('../models/Trainer');

// ---------------------------
// USER LOGIN (by phone only)
// ---------------------------
const userLogin = async (req, res) => {
  try {
    const { phone } = req.body;

    console.log(`[USER LOGIN DEBUG] phone=${phone}`);

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
    console.error('[USER LOGIN DEBUG] Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ---------------------------
// TRAINER LOGIN (by phone only)
// ---------------------------
const trainerLogin = async (req, res) => {
  try {
    const { phone } = req.body;

    console.log(`[TRAINER LOGIN DEBUG] phone=${phone}`);

    if (!phone) {
      return res.status(400).json({ message: 'Phone number required' });
    }

    const trainer = await Trainer.findOne({ phone });

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    console.log('[TRAINER LOGIN DEBUG] Trainer found:', trainer.name);

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
