import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as IOServer } from 'socket.io';

import CONFIG from './config';

const app = express();
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.use(cors({ origin: '*' }));
app.use(router);

const httpServer = http.createServer(app);
const io = new IOServer(httpServer, { cors: { origin: '*' } });

io.on('connection', (socket) => { });

httpServer.listen(CONFIG.PORT, () => {
  console.log(`Server listening on *:${CONFIG.PORT}`);
});
