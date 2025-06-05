import React, { useEffect, useState } from 'react';
import './App.css';
import { getAppBridgeFunction } from './utils/appBridge';
import { BRIDGE_TYPES } from './utils/constants';
import type { Location } from './utils/appBridge';

// Add TypeScript declarations for the bridge
declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        appBridge?: {
          postMessage?: (message: any) => void;
        };
      };
    };
    appBridge?: {
      getCurrentLocation: () => Location;
    };
    androidAppBridge?: {
      getCurrentLocation: () => Location;
    };
  }
}

function App() {
  const [userLocation] = useState<Location | null>(() => getAppBridgeFunction({ type: BRIDGE_TYPES.GEO_LOCATION }));

  console.log('userLocation', userLocation);

  

  return (
    <div className="App">
      <header className="App-header">
        <h1>Location App</h1>
        {/* Debug info */}
        <p style={{ fontSize: '12px', color: '#ccc' }}>
          Debug: {JSON.stringify(userLocation)}
        </p>
        {userLocation ? (
          <div className="location-info">
            <div>
              <p>Your current location:</p>
              <p>Latitude: {userLocation.lat}</p>
              <p>Longitude: {userLocation.lng}</p>
            </div>
          </div>
        ) : (
          <p className="loading">Location not available</p>
        )}
      </header>
    </div>
  );
}

export default App;
