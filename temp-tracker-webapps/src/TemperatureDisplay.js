import React, { useState, useEffect } from 'react';
import ThreeDThermometer from './ThreeDThermometer';
import './TemperatureDisplay.css';

function TemperatureDisplay() {
  const [temperatureC, setTemperatureC] = useState(null);

  useEffect(() => {
    // Connect to the WebSocket server
    const socket = new WebSocket('ws://localhost:8000'); // Update with your WebSocket server URL if necessary

    // Event listener for when the connection is opened
    socket.addEventListener('open', () => {
      console.log('WebSocket connection established');
    });

    // Event listener for receiving messages
    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
    //   console.log('Received data:', data); // Debugging line

      // Check if data contains temperature information
      if (data.temperature !== undefined) {
        const tempC = data.temperature;
        // console.log('Received Temperature (°C):', tempC); // Debugging line
        setTemperatureC(tempC);
      }
    });

    // Event listener for errors
    socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Event listener for connection closure
    socket.addEventListener('close', () => {
    //   console.log('WebSocket connection closed');
    });

    // Cleanup on component unmount
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="temperature-container">
      {temperatureC !== null ? (
        <>
          {/* Render the 3D Thermometer with the current temperature */}
          <ThreeDThermometer
            temperature={temperatureC}
            minTemp={0}
            maxTemp={40}
          />
        </>
      ) : (
        <div className="temperature-loading">Waiting on Data</div>
      )}
    </div>
  );
}

export default TemperatureDisplay;
