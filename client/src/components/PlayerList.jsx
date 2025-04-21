import { motion } from 'framer-motion';

const PlayerList = ({ players, masterId, socketId }) => {
  return (
    <ul className="space-y-2 mt-4">
      {players.map((p) => (
        <motion.li
          key={p.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded p-2 shadow"
        >
          <div className="w-8 h-8 rounded-full bg-gray-300 text-center font-bold text-black dark:text-white">
            {p.username.charAt(0).toUpperCase()}
          </div>
          <span>
            <strong>{p.username}</strong>
            {p.id === socketId && ' (You)'}
            {p.id === masterId && ' 👑 Game Master'}
          </span>
        </motion.li>
      ))}
    </ul>
  );
};

export default PlayerList;
