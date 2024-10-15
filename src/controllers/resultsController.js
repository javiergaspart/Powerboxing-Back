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
    const results = await resultsService.getResultsBySession(sessionId);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  savePunchResult,
  getResultsBySession,
};
