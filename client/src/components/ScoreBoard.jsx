const ScoreBoard = ({ scores }) => {
    const sorted = [...scores].sort((a, b) => b.score - a.score);
  
    return (
      <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="text-lg font-bold mb-2">🏆 Leaderboard</h3>
        <ul className="space-y-1">
          {sorted.map((p, i) => (
            <li
              key={i}
              className="flex justify-between px-2 py-1 bg-white dark:bg-gray-700 rounded"
            >
              <span>
                {i + 1}. <strong>{p.username}</strong>
              </span>
              <span>{p.score} pts</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default ScoreBoard;
  