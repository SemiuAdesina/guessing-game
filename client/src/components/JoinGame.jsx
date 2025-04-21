import { useState } from 'react';
import toast from 'react-hot-toast';
import socket from '../socket';
import RoomCodeInput from './RoomCodeInput';

const JoinGame = ({ onJoin, setSessionId, setIsMaster }) => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  const handleJoin = () => {
    if (!username.trim() || !room.trim()) {
      return toast.error('🚫 Please enter your name and room code!');
    }

    setSessionId(room);
    socket.emit('join_session', { sessionId: room, username });
    setIsMaster(false);
    onJoin(username);

    toast.success('🎉 Joined Game Room!', {
      style: {
        border: '1px solid #3b82f6',
        padding: '12px',
        background: '#eff6ff',
        color: '#1e3a8a',
      },
      icon: '🙌',
    });
  };

  return (
    <div className="space-y-2">
      <input
        placeholder="Your Name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <RoomCodeInput value={room} onChange={(e) => setRoom(e.target.value)} />

      <button
        onClick={handleJoin}
        className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 w-full rounded"
      >
        Join Game
      </button>
    </div>
  );
};

export default JoinGame;
