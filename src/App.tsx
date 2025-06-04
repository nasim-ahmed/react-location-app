import React, { useEffect, useState, useRef } from 'react';
import './App.css';

interface Location {
  latitude: number;
  longitude: number;
  error?: string;
}

// Add TypeScript declarations for the bridge
declare global {
  interface Window {
    appBridge: {
      onLocationReceived: ((location: Location) => void) | null;
    };
    webkit?: {
      messageHandlers?: {
        getLocation?: {
          postMessage: (message: any) => void;
        };
      };
    };
  }
}

function App() {
  const [location, setLocation] = useState<Location | null>(null);
  const locationRequestedRef = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('Setting up appBridge location listener...');
    if (!window.appBridge) {
      window.appBridge = { onLocationReceived: null } as Window['appBridge'];
    }
    window.appBridge.onLocationReceived = (location) => {
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

  // Request location when component mounts
  useEffect(() => {
    if (!locationRequestedRef.current) {
      // eslint-disable-next-line no-console
      console.log('Attempting to request location...');
      locationRequestedRef.current = true;
      if (window.webkit?.messageHandlers?.getLocation) {
        // eslint-disable-next-line no-console
        console.log('[Native Bridge] Detected iOS webkit message handler - requesting location');
        try {
          window.webkit.messageHandlers.getLocation.postMessage(null);
          // eslint-disable-next-line no-console
          console.log('[Native Bridge] Location request sent to native');
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('[Native Bridge] Error sending location request:', e);
          setLocation({
            latitude: 0,
            longitude: 0,
            error: 'Failed to request location from native app'
          });
        }
      } else {
        setLocation({
          latitude: 0,
          longitude: 0,
          error: 'Native location handler not available'
        });
      }
    }
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
                <p>Latitude: {location.latitude.toFixed(6)}</p>
                <p>Longitude: {location.longitude.toFixed(6)}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="loading">Loading location...</p>
        )}
      </header>
    </div>
  );
}

export default App;
