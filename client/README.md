# 🎮 Guessing Game App

A real-time multiplayer guessing game where friends can join a room, guess answers to questions, and compete for the highest score! Built with **Vite + React + TailwindCSS** on the frontend and **Node.js + Express + Socket.IO + MongoDB** on the backend.

---

## 🚀 Features

- Real-time multiplayer guessing
- Game Master creates questions, players guess
- 3 guess attempts per player
- Score tracking with live leaderboard
- Dark mode toggle 🌗
- Chatbox in each room
- "Play Again" system without refreshing
- Auto-rotate Game Master after each round
- Responsive UI for mobile and desktop

---

## 🛠 Technologies Used

**Frontend:**
- Vite + React
- Tailwind CSS
- Framer Motion (animations)
- react-hot-toast (notifications)
- socket.io-client

**Backend:**
- Node.js + Express
- Socket.IO
- MongoDB (optional for storing sessions)

---

## 📦 Project Structure

cd client
npm install

cd ../server
npm install


cd server
node index.js
# or if using nodemon
npm run dev

Guessing-game/
│
├── client/                      # Frontend (Vite + React + TailwindCSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBox.jsx
│   │   │   ├── CreateGame.jsx
│   │   │   ├── GameArea.jsx
│   │   │   ├── JoinGame.jsx
│   │   │   ├── PlayerList.jsx
│   │   │   ├── ScoreBoard.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── utils/
│   │   │   └── generateRoomCode.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── socket.js
│   ├── public/
│   │   └── guessing-game.svg      # Favicon / public assets
│   ├── index.html
│   ├── index.css
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── server/                      # Backend (Node.js + Express + Socket.IO)
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── gameController.js      # (optional for REST APIs)
│   ├── models/
│   │   └── gameModel.js           # (optional for database schema)
│   ├── routes/
│   │   └── gameRoutes.js
│   ├── socket/
│   │   └── socketHandler.js
│   ├── utils/
│   │   └── helperFunctions.js     # (optional)
│   ├── .env
│   └── index.js
│
├── .gitignore                    # Git ignore file (node_modules, .env, etc)
├── README.md                     # Project documentation
├── package.json                  # Project metadata (root or server-specific)
└── LICENSE                       # (optional) Open-source license


Main Features in Detail

Feature	Description
Room Creation	Game Master generates a random room code
Joining Room	Other players enter the code to join
Game Start	Only Master can start when minimum players connected
Guessing	Each player gets 3 attempts to guess
Winning	10 points awarded to the winner
Time Out	If no winner within 60 seconds, round ends
Auto Rotate	Winner or next player becomes the next Master
Chat	Players can chat live
Dark Mode	One-click toggle 🌞/🌙
🛡️ Best Practices Followed
Clean architecture (separated frontend and backend)

Reusable React components

Real-time updates via Socket.IO

Responsive design (Tailwind)

Environment variables to protect secrets

.gitignore to exclude node_modules, .env, and temp files

✨ Future Upgrades (Optional)
Full user authentication (Google / GitHub OAuth)

Persistent storage of games and scores

Admin dashboard for session management

Spectator mode

Emoji reactions in chat

