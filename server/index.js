const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const gameRoutes = require('./routes/gameRoutes');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Init express and HTTP server
const app = express();
const server = http.createServer(app);

// Socket.IO config
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Initialize Socket Handlers
require('./socket/socketHandler')(io);

// Express Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', gameRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Guessing Game Backend is Running 🚀');
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🔌 Server running on http://localhost:${PORT}`);
});
