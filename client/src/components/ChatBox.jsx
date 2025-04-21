import { useEffect, useState } from 'react';
import socket from '../socket';
import toast from 'react-hot-toast';

const ChatBox = ({ sessionId, username }) => {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('receive_chat', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_chat');
    };
  }, []);

  const handleSend = () => {
    if (!msg.trim()) {
      return toast.error('⚠️ You cannot send an empty message');
    }

    socket.emit('send_chat', { sessionId, username, message: msg });
    setMsg('');
  };

  return (
    <div className="mt-6 border-t pt-4">
      <h4 className="font-semibold mb-2">💬 Chat</h4>
      <div className="max-h-60 overflow-y-auto bg-gray-100 dark:bg-gray-800 p-2 rounded">
        {messages.map((m, i) => (
          <div key={i} className="mb-1 text-sm">
            <strong>{m.username}:</strong> {m.message}
          </div>
        ))}
      </div>
      <div className="flex mt-2 gap-2">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="border p-2 flex-1 rounded"
          placeholder="Say something..."
        />
        <button onClick={handleSend} className="bg-gray-800 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
