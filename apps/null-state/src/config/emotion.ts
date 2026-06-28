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
    label: 'Dormant',
    primaryColor: { r: 0.25, g: 0.27, b: 0.28 }, // Graphite
    glowColor: { r: 0.1, g: 0.11, b: 0.12 },
    motionSpeed: 0.1,
    motionJitter: 0.01,
    cameraDriftScale: 0.15,
    cameraDriftSpeed: 0.2,
    cameraZoom: 1.0,
    cameraParallax: 0.05,
    signalInterval: 8.0,
    uiOpacity: 0.3,
    letterSpacing: '4px',
    fontWeight: '300',
    transitionDuration: 2.0,
  },
  {
    label: 'Observer',
    primaryColor: { r: 0.0, g: 0.8, b: 0.6 }, // Jade
    glowColor: { r: 0.0, g: 0.3, b: 0.2 },
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
    label: 'Awakening',
    primaryColor: { r: 0.0, g: 1.0, b: 0.5 }, // Emerald
    glowColor: { r: 0.0, g: 0.4, b: 0.15 },
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
    label: 'Threat',
    primaryColor: { r: 1.0, g: 0.1, b: 0.2 }, // Crimson alert
    glowColor: { r: 0.5, g: 0.0, b: 0.05 },
    motionSpeed: 1.2,
    motionJitter: 0.4, // Muscular trembling
    cameraDriftScale: 0.8, // Muscle-tremor high freq drift
    cameraDriftSpeed: 4.5,
    cameraZoom: 0.95,
    cameraParallax: 0.6,
    signalInterval: 0.8,
    uiOpacity: 1.0,
    letterSpacing: '0px',
    fontWeight: '700',
    transitionDuration: 0.8,
  },
  {
    label: 'Architecture',
    primaryColor: { r: 0.2, g: 0.6, b: 1.0 }, // Technical blue
    glowColor: { r: 0.05, g: 0.15, b: 0.4 },
    motionSpeed: 0.7,
    motionJitter: 0.0,
    cameraDriftScale: 0.2,
    cameraDriftSpeed: 0.3,
    cameraZoom: 0.8, // Isometric macro reveal
    cameraParallax: 0.15,
    signalInterval: 4.0,
    uiOpacity: 0.8,
    letterSpacing: '3px',
    fontWeight: '300',
    transitionDuration: 1.8,
  },
  {
    label: 'Awareness',
    primaryColor: { r: 0.95, g: 0.96, b: 0.97 }, // Clean white
    glowColor: { r: 0.4, g: 0.41, b: 0.42 },
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
