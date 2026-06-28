export interface DiscoveryState {
  currentState: number;
  targetState: number;
  transitionProgress: number; // 0.0 to 1.0 between currentState and targetState
  
  // Virtual Scroll State
  scrollOffset: number;
  scrollTarget: number;
  maxScroll: number;

  // Interaction Metrics
  dwellTime: number;
  interactionTime: number;
  lastInteractionTime: number;

  // Real-time Visual Multipliers (calculated dynamically by RevealSystem)
  nodeSpeedMultiplier: number;
  nodeOpacity: number;
  connectionOpacity: number;
  signalOpacity: number;
  threatOpacity: number;

  // Lock status to ensure smooth progression
  transitionLocked: boolean;
}

export const discoveryState: DiscoveryState = {
  currentState: 0,
  targetState: 0,
  transitionProgress: 1.0,

  scrollOffset: 0,
  scrollTarget: 0,
  maxScroll: 1000, // Total virtual scroll domain

  dwellTime: 0,
  interactionTime: 0,
  lastInteractionTime: 0,

  nodeSpeedMultiplier: 0.08,
  nodeOpacity: 0.1,
  connectionOpacity: 0.0,
  signalOpacity: 0.0,
  threatOpacity: 0.0,

  transitionLocked: false,
};
