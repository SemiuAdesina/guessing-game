import { useEffect, useState, useRef } from 'react';
import socket from '../socket';
import ScoreBoard from './ScoreBoard';
import ChatBox from './ChatBox';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

const GameArea = ({ isMaster, setIsMaster, sessionId, username, players }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameQuestion, setGameQuestion] = useState('');
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [scores, setScores] = useState([]);
  const socketId = useRef(socket.id);

  const submitGame = () => {
    if (!question.trim() || !answer.trim()) {
      return toast.error('❗ Please enter both a question and an answer');
    }
    socket.emit('start_game', { sessionId, question, answer });
    setQuestion('');
    setAnswer('');
  };

  useEffect(() => {
    socket.on('game_started', ({ question }) => {
      setGameStarted(true);
      setGameQuestion(question);
      setFeedback('');
      setScores([]);
      toast.success('🎮 Game started! Make your guesses.');
    });

    socket.on('guess_feedback', ({ message }) => {
      setFeedback(message);
      if (message.includes('No attempts')) {
        toast.error('❌ No attempts left!');
      } else {
        toast(message);
      }
    });

    socket.on('game_winner', ({ winner, answer, scores, nextMasterId }) => {
      setGameStarted(false);
      setFeedback(`${winner} got it right! 🎉 Answer: ${answer}`);
      setScores(scores);
      toast.success(`🏆 ${winner} wins this round!`);

      if (socket.id === nextMasterId) {
        setIsMaster(true);
        toast("👑 You're now the Game Master. Set a new question.");
      } else {
        setIsMaster(false);
      }
    });

    socket.on('game_timeout', ({ answer, scores, nextMasterId }) => {
      setGameStarted(false);
      setFeedback(`⏰ Time's up! The correct answer was: ${answer}`);
      setScores(scores);
      toast('⏳ Round ended. No winner.');

      if (socket.id === nextMasterId) {
        setIsMaster(true);
        toast("👑 You're now the Game Master. Set a new question.");
      } else {
        setIsMaster(false);
      }
    });

    return () => {
      socket.off('game_started');
      socket.off('guess_feedback');
      socket.off('game_winner');
      socket.off('game_timeout');
    };
  }, []);

  return (
    <div className="mt-6">
      {/* Master starts game */}
      {isMaster && !gameStarted && (
        <div className="space-y-2 mb-4 bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
          <input
            placeholder="Enter a question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <input
            placeholder="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <button
            onClick={submitGame}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full"
          >
            Start Game
          </button>
        </div>
      )}

      {/* Game in progress */}
      <AnimatePresence>
        {gameStarted && (
          <motion.div
            key="game-question"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4"
          >
            <p className="text-lg font-semibold">❓ {gameQuestion}</p>
            <div className="mt-3 flex gap-2">
              <input
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                className="border p-2 flex-1 rounded"
                placeholder="Your guess"
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                onClick={() => {
                  if (!guess.trim()) {
                    toast.error('Please enter a guess before submitting.');
                    return;
                  }
                  socket.emit('submit_guess', { sessionId, guess });
                  setGuess('');
                }}
              >
                Submit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback */}
      {feedback && (
        <motion.div
          key="feedback"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-yellow-100 border border-yellow-400 rounded px-3 py-2 mb-4 dark:bg-yellow-900"
        >
          {feedback}
        </motion.div>
      )}

      {/* Scoreboard */}
      {scores.length > 0 && <ScoreBoard scores={scores} />}

      {/* Chat */}
      <ChatBox sessionId={sessionId} username={username} />
    </div>
  );
};

export default GameArea;
