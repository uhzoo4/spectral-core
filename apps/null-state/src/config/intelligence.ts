export interface IntelligenceConfig {
  clusters: {
    count: number;
    driftSpeed: number;
    wanderFrequency: number;
    wanderScale: number;
    baseRadius: number;
  };
  signals: {
    maxActive: number;
    propagationSpeed: number;
    spawnInterval: number;
    maxRadius: number;
  };
  threats: {
    maxActive: number;
    spawnInterval: number;
    lifetime: number;
    radius: number;
    glitchIntensity: number;
  };
  observer: {
    attractionRadius: number;
    attractionStrength: number;
    maxPointerSpeedTrigger: number;
  };
}

export const intelligenceConfig: IntelligenceConfig = {
  clusters: {
    count: 8,
    driftSpeed: 0.15,
    wanderFrequency: 0.5,
    wanderScale: 2.0,
    baseRadius: 10.0,
  },
  signals: {
    maxActive: 8,
    propagationSpeed: 12.0,
    spawnInterval: 2.5,
    maxRadius: 25.0,
  },
  threats: {
    maxActive: 4,
    spawnInterval: 8.0,
    lifetime: 5.0,
    radius: 6.0,
    glitchIntensity: 0.8,
  },
  observer: {
    attractionRadius: 15.0,
    attractionStrength: 0.35,
    maxPointerSpeedTrigger: 5.0,
  },
};
