const mongoose = require('mongoose');

const GameSessionSchema = new mongoose.Schema({
  roomCode: String,
  players: [String], // store player _id
  masterId: String,
  question: String,
  answer: String,
  started: { type: Boolean, default: false },
});

module.exports = mongoose.model('GameSession', GameSessionSchema);
