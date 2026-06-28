import { emotionState, cinematicState } from '@cinematic-engine/core';
import { environmentConfig } from '../../../apps/null-state/src/config/environment';

export class AtmosphereDirector {
  public name = 'AtmosphereDirector';

  public update(time: number, _delta: number): void {
    const config = environmentConfig;

    // 1. Slow, ambient breathing multiplier (0.35 Hz)
    const breath = Math.sin(time * Math.PI * 2 * config.ambientLightBreathingFrequency);
    const normalizedBreath = (breath + 1.0) * 0.5; // Scale to 0..1 range

    // Save breathing state in the global cinematicState
    cinematicState.breathMultiplier = 0.8 + normalizedBreath * 0.4;

    // 2. Modulate ambient glow colors slightly (intensity breathe)
    const glowMin = config.ambientLightIntensityBounds.min;
    const glowMax = config.ambientLightIntensityBounds.max;
    const currentIntensity = glowMin + (glowMax - glowMin) * normalizedBreath;

    // Direct mutation of emotionState variables (0 heap allocations)
    emotionState.glowColor.r = 0.04 * currentIntensity;
    emotionState.glowColor.g = 0.08 * currentIntensity;
    emotionState.glowColor.b = 0.12 * currentIntensity;
  }
}
