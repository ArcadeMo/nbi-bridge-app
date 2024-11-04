import React, { useEffect, useState } from 'react';

function App() {
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    fetch('/api/health')
      .then(response => response.json())
      .then(data => setStatus(data.status))
      .catch(error => console.error('Error fetching API:', error));
  }, []);

  return (
    <div className="App">
      <h1>NBI Bridge App</h1>
      <p>Backend Status: {status}</p>
    </div>
  );
}

export default App;
