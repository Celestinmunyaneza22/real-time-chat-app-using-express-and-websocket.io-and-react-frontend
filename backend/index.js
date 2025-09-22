const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow your frontend URL in production
    methods: ["GET", "POST"]
  }
});

// Store users: socketId -> userId
const users = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('register', (userId) => {
    users.set(socket.id, userId);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on('sendNotification', ({ toUserId, message }) => {
    for (const [socketId, userId] of users.entries()) {
      if (userId === toUserId) {
        io.to(socketId).emit('notification', { message });
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    users.delete(socket.id);
  });
});

server.listen(5000, () => {
  console.log('Server listening on port 5000');
});