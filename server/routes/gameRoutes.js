const express = require('express');
const router = express.Router();
const { getAllSessions, getLeaderboard } = require('../controllers/gameController');

router.get('/sessions', getAllSessions);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
