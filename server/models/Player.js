const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  username: String,
  score: { type: Number, default: 0 },
  roomCode: String,
});

module.exports = mongoose.model('Player', PlayerSchema);
