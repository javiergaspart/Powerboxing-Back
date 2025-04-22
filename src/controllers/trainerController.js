const trainerService = require('../services/trainerService');

exports.loginTrainer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const trainer = await trainerService.loginTrainer(email, password);
    res.status(200).json({ trainer });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
