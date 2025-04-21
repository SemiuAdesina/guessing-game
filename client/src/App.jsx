import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import socket from './socket';
import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import PlayerList from './components/PlayerList';
import GameArea from './components/GameArea';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [joined, setJoined] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [players, setPlayers] = useState([]);
  const [username, setUsername] = useState('');
  const [isMaster, setIsMaster] = useState(false);

  useEffect(() => {
    socket.on('players_update', (list) => setPlayers(list));
    socket.on('error_message', (msg) => toast.error(`⚠️ ${msg}`));

    // Cleanup
    return () => {
      socket.off('players_update');
      socket.off('error_message');
    };
  }, []);

  const onJoin = (name) => {
    setUsername(name);
    setJoined(true);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      <ThemeToggle />

      

      {!joined ? (
        <div className="space-y-4">
          <CreateGame onJoin={onJoin} setSessionId={setSessionId} setIsMaster={setIsMaster} />
          <JoinGame onJoin={onJoin} setSessionId={setSessionId} setIsMaster={setIsMaster} />
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Room: {sessionId}</h2>
          <PlayerList players={players} masterId={players[0]?.id} socketId={socket.id} />
          <GameArea
            isMaster={isMaster}
            setIsMaster={setIsMaster} // ✅ Added this for GameArea to handle next round
            sessionId={sessionId}
            username={username}
            players={players}
          />
        </>
      )}
    </div>
  );
}

export default App;
