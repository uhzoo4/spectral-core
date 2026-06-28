export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface EmotionState {
  currentEmotion: number;
  targetEmotion: number;
  transitionProgress: number; // 0.0 to 1.0

  // Active Interpolated Values
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
}

export const emotionState: EmotionState = {
  currentEmotion: 0,
  targetEmotion: 0,
  transitionProgress: 1.0,

  primaryColor: { r: 0.25, g: 0.27, b: 0.28 },
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
};
