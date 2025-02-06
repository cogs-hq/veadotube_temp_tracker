// server.js
const express = require('express');
const WebSocket = require('ws');
const path = require('path');

// Port configurations
const HTTP_PORT = 5000; // Port for HTTP server (web app), this has been included as a backup if the react apps stop working. Just go to localhost:5000
const WS_PORT = 8000;   // Port for WebSocket server

// Initialize the Express app
const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the HTTP server
app.listen(HTTP_PORT, () => {
  console.log(`HTTP server is listening on http://localhost:${HTTP_PORT}`);
});

// Initialize the WebSocket server for incoming connections
const wss = new WebSocket.Server({ port: WS_PORT }, () => {
  console.log(`WebSocket server is listening on ws://localhost:${WS_PORT}`);
});

// Variable to store connected clients
let clients = [];

// Variable to track Veadotube's current state
let veadotubeState = 'normal'; // Assume 'normal' is the default state

// Establish a WebSocket client connection to Veadotube
const veadotubeWS = new WebSocket('ws://localhost:5271?n=NodeServer'); //Update this port number with what you see in your veadotube client!

veadotubeWS.on('open', () => {
  console.log('Connected to Veadotube via WebSocket.');
});

veadotubeWS.on('message', (message) => {
  console.log('Received message from Veadotube:', message);
});

veadotubeWS.on('error', (error) => {
  console.error('Error in Veadotube WebSocket connection:', error);
});

veadotubeWS.on('close', () => {
  console.log('Veadotube WebSocket connection closed.');
});

// Function to change Veadotube state via WebSocket
function changeVeadotubeState(stateName) {
  if (veadotubeWS.readyState === WebSocket.OPEN) {
    const channel = 'nodes';
    const message = {
      "event": "payload",
      "type": "stateEvents",
      "id": "mini", // Replace 'mini' with the appropriate node ID if necessary
      "payload": { "event": "set", "state": stateName }
    };
    const prefixedMessage = `${channel}:${JSON.stringify(message)}`;
    veadotubeWS.send(prefixedMessage);
    console.log(`Sent state change to Veadotube: ${prefixedMessage}`);
  } else {
    console.error('Cannot send message, Veadotube WebSocket is not open.');
  }
}

// Handle incoming WebSocket connections from clients
wss.on('connection', (ws) => {
  console.log('New client connected');
  clients.push(ws);

  ws.on('message', (message) => {
    // Process the incoming message
    try {
      const data = JSON.parse(message);
      if (data.method === 'NotifyFullStatus') {
        const temperature = data.params['temperature:0'].tC;
        const timestamp = new Date().toLocaleString();
        console.log(`[${timestamp}] Temperature: ${temperature}°C`);

        // Check if temperature exceeds 28°C and change Veadotube state if necessary 
        //NOTE: The veadotubeState should be set to whatever you have named the state in the veadotube client. For me it was 'Hot' and 'Normal'
        if (temperature > 28 && veadotubeState !== 'Hot') {
          veadotubeState = 'Hot';
          changeVeadotubeState('Hot');
        } else if (temperature <= 28 && veadotubeState !== 'Normal') {
          veadotubeState = 'Normal';
          changeVeadotubeState('Normal');
        }

        // Broadcast the temperature to all connected clients
        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ temperature }));
          }
        });
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    // Remove the client from the list
    clients = clients.filter((client) => client !== ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});
