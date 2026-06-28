import { environmentConfig } from '../../../apps/null-state/src/config/environment';

export class DepthHierarchySystem {
  public name = 'DepthHierarchySystem';

  public update(_time: number, _delta: number): void {
    // This system is executed during the update loops to classify node behaviors
  }

  /**
   * Applies depth-based properties to a node's visual representation.
   * Returns a depth-adjusted scale and opacity.
   * Runs inside the instanced mesh generation loop with 0 allocations.
   */
  public getDepthAdjustments(z: number, baseScale: number): { scale: number; opacityMultiplier: number } {
    const config = environmentConfig;

    if (z >= config.foreground.nearLimit) {
      // Foreground
      const norm = Math.min(1.0, (z - config.foreground.nearLimit) / (config.foreground.farLimit - config.foreground.nearLimit || 1.0));
      const opacity = config.foreground.minOpacity + (config.foreground.maxOpacity - config.foreground.minOpacity) * norm;
      return {
        scale: baseScale * config.foreground.scaleFactor,
        opacityMultiplier: opacity,
      };
    } else if (z <= config.background.farLimit) {
      // Background
      const norm = Math.min(1.0, (z - config.background.nearLimit) / (config.background.farLimit - config.background.nearLimit || 1.0));
      const opacity = config.background.minOpacity + (config.background.maxOpacity - config.background.minOpacity) * norm;
      return {
        scale: baseScale * config.background.scaleFactor,
        opacityMultiplier: opacity,
      };
    } else {
      // Midground
      const norm = (z - config.midground.nearLimit) / (config.midground.farLimit - config.midground.nearLimit || 1.0);
      const opacity = config.midground.minOpacity + (config.midground.maxOpacity - config.midground.minOpacity) * norm;
      return {
        scale: baseScale * config.midground.scaleFactor,
        opacityMultiplier: opacity,
      };
    }
  }

  /**
   * Calculates the drift/speed factor based on Z-depth.
   */
  public getDriftMultiplier(z: number): number {
    const config = environmentConfig;
    if (z >= config.foreground.nearLimit) {
      return config.foreground.driftMultiplier;
    } else if (z <= config.background.farLimit) {
      return config.background.driftMultiplier;
    } else {
      return config.midground.driftMultiplier;
    }
  }
}
