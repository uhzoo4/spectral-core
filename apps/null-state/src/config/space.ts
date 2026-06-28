export interface SpaceConfig {
  cameraBasePos: { x: number; y: number; z: number };
  mouseParallaxStrength: number;
  cameraScrollZoomSpeed: number;
  cameraTrackFrequency: number;
  cameraTrackAmplitude: { x: number; y: number; z: number };
  springStiffness: number;
  springDamping: number;
}

export const spaceConfig: SpaceConfig = {
  cameraBasePos: { x: 0, y: 0, z: 20 },
  mouseParallaxStrength: 1.5, // Subtle parallax translation bounds
  cameraScrollZoomSpeed: 0.012, // Camera push-in rate per scroll step
  cameraTrackFrequency: 0.18, // Frequency for slow Lissajous tracking curves
  cameraTrackAmplitude: { x: 1.2, y: 0.8, z: 1.5 },
  springStiffness: 4.5, // Viscous camera easing
  springDamping: 1.8,
};
