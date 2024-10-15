// src/controllers/sessionController.js

const sessionService = require('../services/sessionService');

const createSession = async (req, res) => {
  try {
    const session = await sessionService.createSession(req.body);
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSessions = async (req, res) => {
  try {
    const sessions = await sessionService.getSessions();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSession,
  getSessions,
};
