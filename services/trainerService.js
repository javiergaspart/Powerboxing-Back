const Trainer = require('../models/Trainer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginTrainer = async (email, password) => {
  console.log('[TrainerService] Login attempt for:', email);

  try {
    const trainer = await Trainer.findOne({ email });
    console.log('[TrainerService] Trainer lookup result:', trainer ? 'Found ✅' : 'Not found ❌');

    if (!trainer) {
      throw new Error('Trainer not found');
    }

    const isMatch = await bcrypt.compare(password, trainer.password);
    console.log('[TrainerService] Password match:', isMatch ? 'Yes ✅' : 'No ❌');

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: trainer._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    console.log('[TrainerService] JWT token created for trainer ID:', trainer._id);

    return {
      _id: trainer._id,
      name: trainer.name,
      email: trainer.email,
      token,
    };
  } catch (err) {
    console.error('[TrainerService] Login error:', err.message);
    throw err;
  }
};
