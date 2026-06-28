import { cinematicState } from '@cinematic-engine/core';
import { cinematicConfig } from '../../../apps/null-state/src/config/cinematicDirection';

export class PacingSystem {
  public name = 'PacingSystem';
  private activeFrequency = 0.5;

  public update(time: number, delta: number): void {
    const actIdx = cinematicState.currentActIndex;
    const cfg = cinematicConfig[actIdx];

    if (!cfg) return;

    // Smoothly ease the breathing frequency to prevent sudden cadence shifts
    this.activeFrequency += (cfg.breathFrequency - this.activeFrequency) * Math.min(1.0, delta * 2.0);

    // Calculate a normalized breathing multiplier (sine wave centered between 0.0 and 1.0)
    // Formula: sin(t * freq) * 0.5 + 0.5
    const wave = Math.sin(time * this.activeFrequency * Math.PI * 2) * 0.5 + 0.5;
    cinematicState.breathMultiplier = wave;
  }
}
