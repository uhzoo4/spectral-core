export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface EmotionStateConfig {
  label: string;
  primaryColor: ColorRGB;
  glowColor: ColorRGB;
  motionSpeed: number;
  motionJitter: number;
  cameraDriftScale: number;
  cameraDriftSpeed: number;
  cameraZoom: number;
  cameraParallax: number;
  signalInterval: number;
  uiOpacity: number;
  letterSpacing: string;
  fontWeight: string;
  transitionDuration: number;
}

export const emotionConfig: EmotionStateConfig[] = [
  {
    // State 0: Dormant
    label: 'Dormant',
    primaryColor: { r: 0.12, g: 0.13, b: 0.14 }, // Deep graphite
    glowColor: { r: 0.04, g: 0.04, b: 0.05 },
    motionSpeed: 0.1,
    motionJitter: 0.01,
    cameraDriftScale: 0.15,
    cameraDriftSpeed: 0.2,
    cameraZoom: 1.0,
    cameraParallax: 0.05,
    signalInterval: 8.0,
    uiOpacity: 0.35,
    letterSpacing: '4px',
    fontWeight: '300',
    transitionDuration: 2.0,
  },
  {
    // State 1: Observer
    label: 'Observer',
    primaryColor: { r: 0.0, g: 0.7, b: 0.45 }, // Jade
    glowColor: { r: 0.0, g: 0.25, b: 0.15 },
    motionSpeed: 0.4,
    motionJitter: 0.05,
    cameraDriftScale: 0.3,
    cameraDriftSpeed: 0.5,
    cameraZoom: 1.15,
    cameraParallax: 0.25,
    signalInterval: 3.5,
    uiOpacity: 0.7,
    letterSpacing: '2px',
    fontWeight: '400',
    transitionDuration: 1.5,
  },
  {
    // State 2: Awakening
    label: 'Awakening',
    primaryColor: { r: 0.0, g: 0.9, b: 0.35 }, // Emerald
    glowColor: { r: 0.0, g: 0.35, b: 0.1 },
    motionSpeed: 0.8,
    motionJitter: 0.1,
    cameraDriftScale: 0.45,
    cameraDriftSpeed: 0.8,
    cameraZoom: 1.0,
    cameraParallax: 0.4,
    signalInterval: 2.0,
    uiOpacity: 0.9,
    letterSpacing: '1px',
    fontWeight: '500',
    transitionDuration: 1.2,
  },
  {
    // State 3: Threat
    label: 'Threat',
    primaryColor: { r: 0.9, g: 0.45, b: 0.0 }, // Amber
    glowColor: { r: 0.4, g: 0.18, b: 0.0 },
    motionSpeed: 1.1,
    motionJitter: 0.25, // Confident, controlled tension jitter
    cameraDriftScale: 0.6, // Restrained instability drift
    cameraDriftSpeed: 3.0,
    cameraZoom: 0.95,
    cameraParallax: 0.5,
    signalInterval: 1.2,
    uiOpacity: 1.0,
    letterSpacing: '1px',
    fontWeight: '600',
    transitionDuration: 1.0,
  },
  {
    // State 4: Critical
    label: 'Critical',
    primaryColor: { r: 0.8, g: 0.05, b: 0.12 }, // Restrained Crimson
    glowColor: { r: 0.35, g: 0.0, b: 0.03 },
    motionSpeed: 1.3,
    motionJitter: 0.45,
    cameraDriftScale: 0.75,
    cameraDriftSpeed: 4.2,
    cameraZoom: 0.9,
    cameraParallax: 0.65,
    signalInterval: 0.8,
    uiOpacity: 1.0,
    letterSpacing: '0px',
    fontWeight: '700',
    transitionDuration: 0.8,
  },
  {
    // State 5: Awareness
    label: 'Awareness',
    primaryColor: { r: 0.95, g: 0.95, b: 0.95 }, // Neutral White
    glowColor: { r: 0.35, g: 0.35, b: 0.35 },
    motionSpeed: 0.5,
    motionJitter: 0.02,
    cameraDriftScale: 0.25,
    cameraDriftSpeed: 0.15, // Breath drift
    cameraZoom: 1.05,
    cameraParallax: 0.3,
    signalInterval: 2.5,
    uiOpacity: 0.9,
    letterSpacing: '2px',
    fontWeight: '400',
    transitionDuration: 2.2,
  },
];
