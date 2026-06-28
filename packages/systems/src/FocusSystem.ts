import { Vector3 } from 'three';
import { cinematicState, networkState } from '@cinematic-engine/core';
import { cinematicConfig } from '../../apps/null-state/src/config/cinematicDirection';

export class FocusSystem {
  public name = 'FocusSystem';
  private targetPosition = new Vector3(0, 0, 0);

  public update(time: number, delta: number): void {
    const actIdx = cinematicState.currentActIndex;
    const cfg = cinematicConfig[actIdx];

    if (!cfg) return;

    // 1. Identify primary focal target based on active Act
    if (actIdx === 0) {
      this.targetPosition.set(0, 0, 0);
    } else if (actIdx === 1) {
      if (networkState.pointerActive) {
        this.targetPosition.copy(networkState.pointerPos);
      } else {
        this.targetPosition.set(0, 0, 0);
      }
    } else if (actIdx === 2) {
      let found = false;
      const len = networkState.signals.length;
      for (let i = 0; i < len; i++) {
        if (networkState.signalActive[i]) {
          const sig = networkState.signals[i];
          this.targetPosition.set(sig.x, sig.y, sig.z);
          found = true;
          break;
        }
      }
      if (!found) {
        this.targetPosition.set(0, 0, 0);
      }
    } else if (actIdx === 3 || actIdx === 4) {
      let found = false;
      const len = networkState.threats.length;
      for (let i = 0; i < len; i++) {
        if (networkState.threatActive[i]) {
          const thr = networkState.threats[i];
          this.targetPosition.set(thr.x, thr.y, thr.z);
          found = true;
          break;
        }
      }
      if (!found) {
        if (networkState.pointerActive) {
          this.targetPosition.copy(networkState.pointerPos);
        } else {
          this.targetPosition.set(0, 0, 0);
        }
      }
    } else {
      this.targetPosition.set(0, 0, 0);
    }

    // 2. Smoothly ease active focus boundaries
    const ease = Math.min(1.0, delta * 3.0);
    cinematicState.focusPosition.x += (this.targetPosition.x - cinematicState.focusPosition.x) * ease;
    cinematicState.focusPosition.y += (this.targetPosition.y - cinematicState.focusPosition.y) * ease;
    cinematicState.focusPosition.z += (this.targetPosition.z - cinematicState.focusPosition.z) * ease;

    cinematicState.focusRadius += (cfg.focusRadius - cinematicState.focusRadius) * ease;
  }
}
