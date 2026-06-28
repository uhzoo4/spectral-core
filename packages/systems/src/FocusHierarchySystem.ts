import { networkState, cinematicState, MAX_SIGNALS, MAX_THREATS } from '@cinematic-engine/core';
import { Vector3 } from 'three';

export class FocusHierarchySystem {
  public name = 'FocusHierarchySystem';
  private targetFocus = new Vector3();
  private focusLerpSpeed = 2.5;

  public update(_time: number, delta: number): void {
    // 1. Evaluate focal gravity weights
    let focalPosition: Vector3 | null = null;

    // Highest priority: Active threats (if any)
    for (let i = 0; i < MAX_THREATS; i++) {
      if (networkState.threatActive[i]) {
        // Glitch anomalies attract strong focus
        const threat = networkState.threats[i];
        this.targetFocus.set(threat.x, threat.y, threat.z);
        focalPosition = this.targetFocus;
        break;
      }
    }

    // Secondary priority: Active signal wavefronts
    if (!focalPosition) {
      for (let i = 0; i < MAX_SIGNALS; i++) {
        if (networkState.signalActive[i]) {
          const signal = networkState.signals[i];
          this.targetFocus.set(signal.x, signal.y, signal.z);
          focalPosition = this.targetFocus;
          break;
        }
      }
    }

    // Tertiary priority: Pointer interaction focus
    if (!focalPosition && networkState.pointerActive) {
      this.targetFocus.copy(networkState.pointerPos);
      focalPosition = this.targetFocus;
    }

    // Default fallback: Center of the network clusters
    if (!focalPosition) {
      this.targetFocus.set(0, 0, 0);
    }

    // 2. Smoothly transition focus position
    const t = Math.min(1.0, delta * this.focusLerpSpeed);
    cinematicState.focusPosition.lerp(this.targetFocus, t);

    // 3. Modulate focus radius (breathing size)
    const targetRadius = focalPosition ? 6.5 : 4.0;
    cinematicState.focusRadius += (targetRadius - cinematicState.focusRadius) * t;
  }
}
