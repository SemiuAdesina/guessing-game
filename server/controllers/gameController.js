const GameSession = require('../models/GameSession');
const Player = require('../models/Player');

// GET /api/sessions
const getAllSessions = async (req, res) => {
  try {
    const sessions = await GameSession.find().populate('players');
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};

// GET /api/leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const topPlayers = await Player.find().sort({ score: -1 }).limit(10);
    res.json(topPlayers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load leaderboard' });
  }
};

module.exports = {
  getAllSessions,
  getLeaderboard,
};
