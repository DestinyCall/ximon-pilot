const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { Worker, isMainThread } = require('worker_threads');
const cors = require('cors');
const path = require('path');
const { fetchDataFromApi } = require('./data-api');

if (isMainThread) {
  // new Worker(path.join(__dirname, 'server_worker.js'));
  new Worker(path.join(__dirname, 'client.js'));
  console.log('Main thread.');
}

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });
const port = 5000;

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log('Server: Client connected');

  // process client's incoming message
  socket.on('messageFromClient', (data) => {
    console.log(`Server: Received: ${data}`);
    socket.emit('messageForClient', `Server: Echo: ${data}`);
  });

  // worker thread message in case of event after data processing
  socket.on('eventDataFromClient', (data) => {
    console.log(`Server: Event Received: ${JSON.stringify(data, null, 2)}`);
    socket.emit('messageForClient', `Server: Echo: ${JSON.stringify(data, null, 2)}`);
  });

  //web page api handler
  socket.on('requestData', async () => {
    try {
      const apiData = await fetchDataFromApi();
      socket.emit('apiData', apiData);
    } catch (error) {
      console.error('API Error:', error);
      socket.emit('apiError', { message: 'Error fetching data' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Server: Client disconnected');
  });
});

app.get('/', (req, res, next) => {
  res.json('Main Thread running');
});
server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
