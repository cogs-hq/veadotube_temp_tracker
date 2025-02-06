import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // handles the routing for the different components
import TemperatureDisplay from './TemperatureDisplay';
import DigitalTemperatureDisplay from './DigitalTemperatureDisplay';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TemperatureDisplay />} /> 
        <Route path="/digitaltemp" element={<DigitalTemperatureDisplay />} />
      </Routes>
    </Router>
  );
}

export default App;
