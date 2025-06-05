export const BRIDGE_TYPES = {
  GEO_LOCATION: 'GEO_LOCATION'
} as const;

export type BridgeType = typeof BRIDGE_TYPES[keyof typeof BRIDGE_TYPES]; 