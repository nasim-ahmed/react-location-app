import { BRIDGE_TYPES, BridgeType } from './constants';

export interface Location {
  lat: number;
  lng: number;
}

export interface BridgeAvailability {
  iOS: boolean;
  Android: boolean;
}

export const getAppBridgeAvailability = (): BridgeAvailability => {
  const iOS = Boolean(window?.webkit?.messageHandlers?.appBridge);
  const Android = Boolean(window?.androidAppBridge);
  
  return {
    iOS,
    Android
  };
};

export const getGeoLocation = (): Location | null => {
  const { iOS, Android } = getAppBridgeAvailability();
  
  let location: Location | null = null;

  if (iOS && window?.appBridge?.getCurrentLocation) {
    location = window.appBridge.getCurrentLocation();
  } else if (Android && window?.androidAppBridge?.getCurrentLocation) {
    location = window.androidAppBridge.getCurrentLocation();
  }

  return location;
};

export const getAppBridgeFunction = ({ type }: { type: BridgeType }) => {
  switch (type) {
    case BRIDGE_TYPES.GEO_LOCATION:
      return getGeoLocation();
    default:
      return null;
  }
}; 