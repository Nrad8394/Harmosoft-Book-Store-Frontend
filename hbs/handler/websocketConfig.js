// websocketConfig.js

const socket = new WebSocket('ws://127.0.0.1:8000/ws/transactions/');

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    alert(data.message);  // Or update your UI accordingly
};
