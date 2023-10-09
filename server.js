const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

const roomMessages = {};  // объект для хранения сообщений каждой комнаты

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join room', (room) => {
    socket.join(room);
    console.log(`Client joined room: ${room}`);
    socket.emit('update messages', roomMessages[room] || []);  // отправка истории сообщений при входе в комнату
  });

  socket.on('leave room', (room) => {
    socket.leave(room);
    console.log(`Client left room: ${room}`);
  });

  socket.on('message', (room, message) => {
    roomMessages[room] = roomMessages[room] || [];
    roomMessages[room].push(message);  // сохранение сообщения в истории комнаты
    io.to(room).emit('message', message);  // отправка нового сообщения в комнату
    io.to(room).emit('update messages', roomMessages[room]);  // отправка обновленного списка сообщений в комнату
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
