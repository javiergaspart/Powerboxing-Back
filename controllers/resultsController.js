// src/controllers/resultsController.js

const resultsService = require('../services/resultsService');

const savePunchResult = async (req, res) => {
  try {
    const result = await resultsService.savePunchResult(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getResultsBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    console.log(`Fetching results for session: ${sessionId}`); // Debugging log

    const results = await resultsService.getResultsBySession(sessionId);

    if (!results || results.length === 0) {
      return res.status(404).json({ success: false, message: "No results found for this session" });
    }

    res.status(200).json({
      success: true,
      data: results.map(result => ({
        id: result._id.toString(),
        sessionId: result.sessionId.toString(),
        userId: result.userId?._id.toString() || "", // Ensure it's a string, handle null
        username: result.userId?.username || "Unknown", // Handle missing username
        accuracy: result.accuracy ?? 0, // Default to 0 if null
        power: result.power ?? 0, // Default to 0 if null
      })),
    });
  } catch (error) {
    console.error("Error in getResultsBySession:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


const updatePunchResult = async (req, res) => {
  try {
    const { sessionId, userId } = req.params;
    const { power, energy, accuracy } = req.body;

    console.log(`Updating result for session ${sessionId}, user ${userId}`);

    const updatedResult = await resultsService.updatePunchResult(sessionId, userId, power, energy, accuracy);

    if (!updatedResult) {
      return res.status(404).json({ success: false, message: "Punch result not found or updated" });
    }

    res.status(200).json({ success: true, data: updatedResult });
  } catch (error) {
    console.error("Error in updatePunchResult:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = {
  savePunchResult,
  getResultsBySession,
  updatePunchResult,
};
