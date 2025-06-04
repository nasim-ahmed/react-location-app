import React, { useEffect, useState } from 'react';
import './App.css';

interface Location {
  latitude: number;
  longitude: number;
  error?: string;
}

// Add TypeScript declarations for the bridge
declare global {
  interface Window {
    appBridge?: {
      onLocationReceived: ((location: Location) => void) | null;
    };
  }
}

function App() {
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    console.log('Setting up appBridge location listener...');
  
    // Wait briefly to ensure native JS injection had a chance to run
    setTimeout(() => {
      if (!window.appBridge) {
        window.appBridge = {} as any;
      }
  
      (window.appBridge as any).onLocationReceived = (location: Location) => {
        console.log('[Native Bridge] Location received from iOS:', location);
        setLocation(location);
        document.body.style.backgroundColor = '#4CAF50';
      };
    }, 100); 
  
    return () => {
      console.log('Cleaning up appBridge location listener');
      if (window.appBridge) {
        window.appBridge.onLocationReceived = null;
      }
      document.body.style.backgroundColor = '#282c34';
    };
  }, []);
  

  return (
    <div className="App">
      <header className="App-header">
        <h1>Location App</h1>
        {/* Debug info */}
        <p style={{ fontSize: '12px', color: '#ccc' }}>
          Debug: {JSON.stringify(location)}
        </p>
        {location ? (
          <div className="location-info">
            {location.error ? (
              <p className="error-message">Error: {location.error}</p>
            ) : (
              <div>
                <p>Your current location:</p>
                <p>Latitude: {location.latitude}</p>
                <p>Longitude: {location.longitude}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="loading">Waiting for location...</p>
        )}
      </header>
    </div>
  );
}

export default App;
