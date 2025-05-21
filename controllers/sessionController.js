// Controller function to save trainer slots (new structure using slots[])
const saveTrainerSlots = async (req, res) => {
  try {
    const { trainerId, slots } = req.body;

    if (!trainerId || !Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields in the request body!',
      });
    }

    const sessionsToInsert = slots.map(iso => {
      const dt = new Date(iso);
      const formatted = `${dt.getFullYear()}.${(dt.getMonth() + 1).toString().padStart(2, '0')}.${dt.getDate().toString().padStart(2, '0')}:${dt.getHours().toString().padStart(2, '0')}${dt.getMinutes().toString().padStart(2, '0')}`;

      return {
        trainerId,
        slot: formatted,
        createdAt: new Date(),
      };
    });

    // Replace this with your actual MongoDB insert logic
    const result = await sessionService.insertTrainerSessions(sessionsToInsert);

    return res.status(200).json({
      success: true,
      message: 'Sessions created successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error in saveTrainerSlots:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
