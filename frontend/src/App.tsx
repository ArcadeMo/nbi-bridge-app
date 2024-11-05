// App.tsx
import React from 'react';
import MapComponent from './components/MapComponent'; // Import the main Map component
import './App.css'; // Optional CSS file for global styling

function App() {
  return (
    <div className="App">
      <header>
        <h1>NBI Bridge App</h1>
      </header>
      {/* Render the Map Component */}
      <MapComponent />
    </div>
  );
}

export default App;
