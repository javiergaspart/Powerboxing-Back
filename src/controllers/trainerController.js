const trainerService = require('../services/trainerService');

exports.getTrainerSlotsForDate = async (req, res) => {
  const { trainerId } = req.params;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Date is required in query parameters' });
  }

  try {
    const slots = await trainerService.getSlotsForTrainerByDate(trainerId, date);
    res.status(200).json(slots);
  } catch (err) {
    console.error('Error fetching trainer slots:', err);
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
};

exports.getPastSessionsByTrainer = async (req, res) => {
  const { trainerId } = req.params;
  const { date } = req.query;

  // Ensure the date is valid
  const parsedDate = Date.parse(date);

  if (isNaN(parsedDate)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid date format. Please provide a valid date.',
    });
  }

  try {
    const sessions = await trainerService.getPastSessionsByTrainer(trainerId, new Date(parsedDate));
    return res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error('❌ Error in getPastSessionsByTrainer:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.loginTrainer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const trainer = await trainerService.loginTrainer(email, password);
    res.status(200).json({ trainer });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
