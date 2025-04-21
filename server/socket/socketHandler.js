const GameSession = require('../models/GameSession');
const Player = require('../models/Player');

const gameSessions = {}; // In-memory cache to pair with MongoDB

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`🟢 User connected: ${socket.id}`);

    // Create Game Session
    socket.on('create_session', async ({ sessionId, username }) => {
      try {
        if (gameSessions[sessionId]) {
          socket.emit('error_message', 'Room code already in use');
          return;
        }

        const player = await Player.create({ username, score: 0, roomCode: sessionId });

        const newSession = await GameSession.create({
          roomCode: sessionId,
          players: [player._id],
          masterId: player._id,
        });

        gameSessions[sessionId] = {
          players: [{ id: socket.id, username, dbId: player._id, score: 0, attemptsLeft: 3 }],
          masterId: socket.id,
          started: false,
          question: '',
          answer: '',
        };

        socket.join(sessionId);
        io.to(sessionId).emit('players_update', gameSessions[sessionId].players);
      } catch (err) {
        console.error(err);
        socket.emit('error_message', 'Failed to create session');
      }
    });

    // Join Game Session
    socket.on('join_session', async ({ sessionId, username }) => {
      try {
        const session = gameSessions[sessionId];
        const dbSession = await GameSession.findOne({ roomCode: sessionId });

        if (!session || !dbSession || session.started) {
          socket.emit('error_message', 'Cannot join — session not found or already started');
          return;
        }

        const player = await Player.create({ username, score: 0, roomCode: sessionId });

        session.players.push({ id: socket.id, username, dbId: player._id, score: 0, attemptsLeft: 3 });
        dbSession.players.push(player._id);
        await dbSession.save();

        socket.join(sessionId);
        io.to(sessionId).emit('players_update', session.players);
      } catch (err) {
        console.error(err);
        socket.emit('error_message', 'Failed to join session');
      }
    });

    // Start Game
    socket.on('start_game', ({ sessionId, question, answer }) => {
      const session = gameSessions[sessionId];

      if (!session || session.masterId !== socket.id || session.players.length < 3) {
        socket.emit('error_message', 'Only the Game Master can start the game (min 3 players)');
        return;
      }

      session.question = question;
      session.answer = answer.toLowerCase();
      session.started = true;
      session.players.forEach(p => (p.attemptsLeft = 3));

      io.to(sessionId).emit('game_started', { question });

      // Auto-timeout after 60s
      setTimeout(() => {
        if (session.started) {
          session.started = false;

          rotateGameMaster(sessionId);
          io.to(sessionId).emit('game_timeout', {
            answer: session.answer,
            scores: session.players.map(({ username, score }) => ({ username, score })),
            nextMasterId: session.masterId,
          });
        }
      }, 60000);
    });

    // Handle Guesses
    socket.on('submit_guess', ({ sessionId, guess }) => {
      const session = gameSessions[sessionId];
      if (!session || !session.started) return;

      const player = session.players.find(p => p.id === socket.id);
      if (!player || player.attemptsLeft === 0) {
        socket.emit('guess_feedback', { message: 'No attempts left' });
        return;
      }

      if (guess.toLowerCase() === session.answer) {
        session.started = false;
        player.score += 10;

        rotateGameMaster(sessionId);
        io.to(sessionId).emit('game_winner', {
          winner: player.username,
          answer: session.answer,
          scores: session.players.map(({ username, score }) => ({ username, score })),
          nextMasterId: session.masterId,
        });
      } else {
        player.attemptsLeft -= 1;
        socket.emit('guess_feedback', {
          message: `Wrong! Attempts left: ${player.attemptsLeft}`,
        });
      }
    });

    // Handle Chat
    socket.on('send_chat', ({ sessionId, username, message }) => {
      io.to(sessionId).emit('receive_chat', {
        username,
        message,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle Disconnect
    socket.on('disconnect', () => {
      for (let sessionId in gameSessions) {
        const session = gameSessions[sessionId];
        session.players = session.players.filter(p => p.id !== socket.id);

        if (session.players.length === 0) {
          delete gameSessions[sessionId];
        } else {
          io.to(sessionId).emit('players_update', session.players);
        }
      }

      console.log(`🔴 User disconnected: ${socket.id}`);
    });

    // Rotate Game Master
    function rotateGameMaster(sessionId) {
      const session = gameSessions[sessionId];
      if (!session || session.players.length === 0) return;

      const currentIndex = session.players.findIndex(p => p.id === session.masterId);
      const nextIndex = (currentIndex + 1) % session.players.length;
      session.masterId = session.players[nextIndex].id;
    }
  });
};
