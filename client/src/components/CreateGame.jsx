import { useState } from 'react';
import socket from '../socket';
import { generateRoomCode } from '../utils/generateRoomCode';
import toast from 'react-hot-toast';

const CreateGame = ({ onJoin, setSessionId, setIsMaster }) => {
  const [username, setUsername] = useState('');

  const handleCreate = () => {
    if (!username.trim()) {
      return toast.error('🚫 Please enter your name!');
    }

    const code = generateRoomCode();
    setSessionId(code);
    socket.emit('create_session', { sessionId: code, username });
    setIsMaster(true);
    onJoin(username);

    toast.success('🎉 Game Room Created!', {
      style: {
        border: '1px solid #4ade80',
        padding: '12px',
        background: '#f0fdf4',
        color: '#065f46',
      },
      icon: '✅',
    });
  };

  return (
    <div className="space-y-2">
      <input
        placeholder="Your Name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        onClick={handleCreate}
        className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 w-full rounded"
      >
        Create Game
      </button>
    </div>
  );
};

export default CreateGame;
