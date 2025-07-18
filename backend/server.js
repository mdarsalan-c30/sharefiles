
const WebSocket = require('ws');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const wss = new WebSocket.Server({ server: http });

const clients = new Map();

wss.on('connection', (ws) => {
  const id = Date.now();
  clients.set(id, ws);
  console.log(`Client connected: ${id}`);

  ws.on('message', (message) => {
    for (let [clientId, client] of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  });

  ws.on('close', () => {
    clients.delete(id);
    console.log(`Client disconnected: ${id}`);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
