// server_worker.js
const net = require('net');

const server = net.createServer((socket) => {
  console.log('Server: Client connected');

  socket.on('data', (data) => {
    console.log(`Server: Received: ${data}`);
    socket.write(`Server: Echo: ${data}`);
  });

  socket.on('end', () => {
    console.log('Server: Client disconnected');
  });

  socket.on('error', (err) => {
    console.error(`Server: Socket error: ${err.message}`);
  });
});

server.on('error', (err) => {
  console.error(`Server error: ${err.message}`);
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
