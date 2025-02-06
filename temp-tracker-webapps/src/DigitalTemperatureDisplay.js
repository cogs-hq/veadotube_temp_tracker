import React, { useState, useEffect } from 'react';
import './DigitalTemperatureDisplay.css';

function DigitalTemperatureDisplay() {
  const [temperatureC, setTemperatureC] = useState(null);
  const [temperatureF, setTemperatureF] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    // Connect to the WebSocket server
    const socket = new WebSocket('ws://localhost:8000'); // Update with your different WebSocket server URL if necessary

    socket.addEventListener('open', () => {
      console.log('WebSocket connection established');
    });

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      if (data.temperature !== undefined) {
        const tempC = parseFloat(data.temperature);
        const tempF = (tempC * 9) / 5 + 32;

        setTemperatureC(tempC.toFixed(1));
        setTemperatureF(tempF.toFixed(1));

        // Check if the temperature is at the specified thresholds
        const roundedTemp = Math.round(tempC);
        if ([20, 24, 28].includes(roundedTemp)) {
          setIsFlashing(true);
          // Stop flashing after 2 seconds
          const flashTimeout = setTimeout(() => {
            setIsFlashing(false);
          }, 2000);

          // Clean up the timeout when the component unmounts or when temperature changes
          return () => clearTimeout(flashTimeout);
        }
      }
    });

    socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });

    socket.addEventListener('close', () => {
      console.log('WebSocket connection closed');
    });

    // Cleanup on component unmount
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="digital-temperature-container">
      {temperatureC !== null && temperatureF !== null ? (
        <div className={`digital-temperature-display ${isFlashing ? 'flash' : ''}`}>
          <div className="temperature-value">
            {temperatureC}°C / {temperatureF}°F
          </div>
        </div>
      ) : (
        <div className="temperature-loading">Waiting on Data...</div>
      )}
    </div>
  );
}

export default DigitalTemperatureDisplay;
