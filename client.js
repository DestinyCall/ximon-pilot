const io = require('socket.io-client');
const { fetchDataFromApi } = require('./data-api');

const socket = io('http://localhost:5000');

//if connected send data in certain interval
socket.on('connect', () => {
  console.log('Client: Connected to server');

  //for data event
  const apiInterval = setInterval(async () => {
    try {
      const apiData = await fetchDataFromApi();
      socket.emit('eventDataFromClient', apiData);
    } catch (error) {
      console.error('API Error:', error);
      socket.emit('apiError', { message: 'Error fetching data' });
    }
  }, 3000); // Send data every 3 seconds

  //for generic event
  const dataInterval = setInterval(() => {
    const message = `Client: Data at ${new Date().toLocaleTimeString()}`;
    socket.emit('messageFromClient', message);
    console.log(`Client: Sent: ${message}`);
  }, 3000); // Send data every 3 seconds

  socket.on('disconnect', () => {
    clearInterval(apiInterval);
    clearInterval(dataInterval);
    console.log('Client: Disconnected from server');
  });
});

socket.on('messageForClient', (data) => {
  console.log(`Client: Received: ${data}`);
});
