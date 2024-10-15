// src/services/sessionService.js

const Session = require('../models/Session');

const createSession = async (sessionData) => {
  const session = new Session(sessionData);
  await session.save();
  return session;
};

const getSessions = async () => {
  return await Session.find().populate('participants').populate('punchingBags');
};

module.exports = {
  createSession,
  getSessions,
};
