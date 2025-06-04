interface LocationModule {
  getCurrentLocation(): Promise<{
    latitude: number;
    longitude: number;
    error?: string;
  }>;
}

declare global {
  interface Window {
    LocationModule: LocationModule;
  }
}

export const getCurrentLocation = async (): Promise<{
  latitude: number;
  longitude: number;
  error?: string;
}> => {
  if (window.LocationModule) {
    try {
      return await window.LocationModule.getCurrentLocation();
    } catch (error) {
      return {
        latitude: 0,
        longitude: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  } else {
    return {
      latitude: 0,
      longitude: 0,
      error: 'Native location module not available'
    };
  }
}; 