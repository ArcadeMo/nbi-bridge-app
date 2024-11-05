// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MapComponent from './components/MapComponent'; // Import the main Map component
import Heatmap3D from './components/HeatMap3D'; // Import the 3D heatmap component
import './App.css'; // Optional CSS file for global styling

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <h1>NBI Bridge App</h1>
          {/* Navigation Links */}
          <nav>
            <ul>
              <li><Link to="/">Standard Map</Link></li>
              <li><Link to="/3d-heatmap">3D Heatmap</Link></li>
            </ul>
          </nav>
        </header>
        
        {/* Define routes for each page */}
        <Routes>
          <Route path="/" element={<MapComponent />} />
          <Route path="/3d-heatmap" element={<Heatmap3D />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
