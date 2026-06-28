export interface DepthWorldConfig {
  nearLimit: number;
  farLimit: number;
  minOpacity: number;
  maxOpacity: number;
  scaleFactor: number;
  driftMultiplier: number;
}

export interface EnvironmentConfig {
  foreground: DepthWorldConfig;
  midground: DepthWorldConfig;
  background: DepthWorldConfig;
  ambientLightBreathingFrequency: number;
  ambientLightIntensityBounds: { min: number; max: number };
}

export const environmentConfig: EnvironmentConfig = {
  foreground: {
    nearLimit: 5.0,
    farLimit: 12.0,
    minOpacity: 0.15,
    maxOpacity: 0.70,
    scaleFactor: 2.2, // Larger, personal elements
    driftMultiplier: 1.4, // Responsive and quick
  },
  midground: {
    nearLimit: -5.0,
    farLimit: 5.0,
    minOpacity: 0.35,
    maxOpacity: 0.90,
    scaleFactor: 1.0,
    driftMultiplier: 0.7,
  },
  background: {
    nearLimit: -30.0,
    farLimit: -5.0,
    minOpacity: 0.05,
    maxOpacity: 0.25, // Soft whispering background
    scaleFactor: 0.35, // Small, massive structures
    driftMultiplier: 0.08, // Almost motionless
  },
  ambientLightBreathingFrequency: 0.35, // Slow inhalation/exhalation of ambient light
  ambientLightIntensityBounds: { min: 0.05, max: 0.22 },
};
