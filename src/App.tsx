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
    // webkit?: {
    //   messageHandlers?: {
    //     getLocation?: {
    //       postMessage: (message: any) => void;
    //     };
    //   };
    // };
  }
}

function App() {
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('Setting up appBridge location listener...');
    if (!window.appBridge) {
      window.appBridge = { onLocationReceived: null } as Window['appBridge'];
    }
    window.appBridge!.onLocationReceived = (location) => {
      // eslint-disable-next-line no-console
      console.log('[Native Bridge] Location received from iOS:', location);
      setLocation(location);
    };

    return () => {
      // eslint-disable-next-line no-console
      console.log('Cleaning up appBridge location listener');
      if (window.appBridge) {
        window.appBridge.onLocationReceived = null;
      }
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Location App</h1>
        {location ? (
          <div className="location-info">
            {location.error ? (
              <p className="error-message">Error: {location.error}</p>
            ) : (
              <div>
                <p>Your current location:</p>
                <p>Latitude: {location.latitude?.toFixed(6)}</p>
                <p>Longitude: {location.longitude?.toFixed(6)}</p>
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
