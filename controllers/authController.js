const User = require('../models/User');

exports.login = async (req, res) => {
  const { phone } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user, token: 'mock_token' });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

exports.trainerLogin = async (req, res) => {
  const { phone } = req.body;

  try {
    const trainer = await User.findOne({ phone, role: 'trainer' });
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    res.status(200).json({ user: trainer, token: 'mock_token' });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
