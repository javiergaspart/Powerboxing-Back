// src/services/resultsService.js

const PunchResult = require('../models/PunchResult');

const savePunchResult = async (resultData) => {
  const result = new PunchResult(resultData);
  await result.save();
  return result;
};

const getResultsBySession = async (sessionId) => {
  try {
    const results = await PunchResult.find({ sessionId })
      .populate('userId', 'username') // Populate username from userId reference
      .select('power energy accuracy sessionId'); // Select only necessary fields

    console.log("Fetched Results:", results); // Debugging log
    return results;
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
};

const updatePunchResult = async (sessionId, userId, power, energy, accuracy) => {
  try {
    const updatedResult = await PunchResult.findOneAndUpdate(
      { sessionId, userId }, 
      { power, energy, accuracy },
      { new: true, upsert: true } // Create if not exists
    );

    return updatedResult;
  } catch (error) {
    console.error("Error updating punch result:", error);
    throw error;
  }
};


module.exports = {
  savePunchResult,
  getResultsBySession,
  updatePunchResult,
};
