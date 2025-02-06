import React, { useEffect, useState } from 'react';
import './ThreeDThermometer.css';


function ThreeDThermometer({ temperature, minTemp = 0, maxTemp = 40 }) {
  // Calculate the Fahrenheit equivalent
  const temperatureF = ((temperature * 9) / 5 + 32).toFixed(1);
  const floatC = temperature.toFixed(1); //float of 1 decimal point to align with the F values

  // Calculate the fill percentage
  const fillPercentage = ((temperature - minTemp) / (maxTemp - minTemp)) * 100;

  // Clamp the fill percentage between 0% and 100%
  const clampedFill = Math.max(0, Math.min(fillPercentage, 100));

  // State to control the shaking animation
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const roundedTemp = Math.round(temperature);
    let shakeDuration = 2000; // Default duration in milliseconds
    let animationCount = 4;   // Default shake repetitions
  
    if (roundedTemp === 20) {
      shakeDuration = 1000;
      animationCount = 2;
    } else if (roundedTemp === 24) {
      shakeDuration = 2000;
      animationCount = 4;
    } else if (roundedTemp === 28) {
      shakeDuration = 3000;
      animationCount = 6;
    }
  
    if ([20, 24, 28].includes(roundedTemp)) {
      setIsShaking(true);
      // Update CSS variable for animation count
      document.documentElement.style.setProperty('--shake-count', animationCount);
      // Stop shaking after the specified duration
      const shakeTimeout = setTimeout(() => {
        setIsShaking(false);
      }, shakeDuration);
      return () => clearTimeout(shakeTimeout);
    }
  }, [temperature]);


  return (
    <div className={`thermometer-container ${isShaking ? 'shake' : ''}`}>
      {/* Temperature Labels */}
      <div
        className="temperature-label temperature-label-left"
        style={{ bottom: `${clampedFill}%` }}
      >
        {floatC}°C
      </div>
      <div
        className="temperature-label temperature-label-right"
        style={{ bottom: `${clampedFill}%` }}
      >
        {temperatureF}°F
      </div>
      <div className="thermometer">
        {/* Mercury Level */}
        <div
          className="mercury"
          style={{ height: `${clampedFill}%` }}
        ></div>
      </div>
      <div className="thermometer-base"></div>
      <div className="thermometer-shadow"></div>
    </div>
  );
}

export default ThreeDThermometer;
