// src/services/resultsService.js

const PunchResult = require('../models/PunchResult');

const savePunchResult = async (resultData) => {
  const result = new PunchResult(resultData);
  await result.save();
  return result;
};

const getResultsBySession = async (sessionId) => {
  return await PunchResult.find({ sessionId }).populate('userId');
};

module.exports = {
  savePunchResult,
  getResultsBySession,
};
