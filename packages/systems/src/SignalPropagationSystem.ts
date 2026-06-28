import { networkState, MAX_SIGNALS } from '@cinematic-engine/core';

export interface SignalSystemConfig {
  propagationSpeed: number;
  spawnInterval: number;
  maxRadius: number;
}

export class SignalPropagationSystem {
  public name = 'SignalPropagationSystem';
  private config: SignalSystemConfig;
  private spawnTimer = 0;
  private currentClusterIndex = 0;

  constructor(config?: Partial<SignalSystemConfig>) {
    this.config = {
      propagationSpeed: 12.0,
      spawnInterval: 2.5,
      maxRadius: 25.0,
      ...config,
    };
  }

  public update(time: number, delta: number): void {
    // 1. Progress and update active signals
    for (let i = 0; i < MAX_SIGNALS; i++) {
      if (networkState.signalActive[i]) {
        const signal = networkState.signals[i];
        let radius = signal.w;
        radius += this.config.propagationSpeed * delta;

        if (radius > this.config.maxRadius) {
          networkState.signalActive[i] = false;
          networkState.signals[i].set(0, 0, 0, 0);
        } else {
          signal.w = radius;
        }
      }
    }

    // 2. Spawn timer logic
    this.spawnTimer += delta;
    
    let interval = this.config.spawnInterval;
    if (networkState.pointerActive && networkState.pointerSpeed > 1.0) {
      interval /= Math.min(3.0, networkState.pointerSpeed);
    }

    if (this.spawnTimer >= interval) {
      this.spawnTimer = 0;
      this.triggerSignalAtCluster();
    }
  }

  public triggerSignalAtCluster(): void {
    const clusterCount = networkState.clusterCounts;
    if (clusterCount <= 0) return;

    this.currentClusterIndex = (this.currentClusterIndex + 1) % clusterCount;
    const spawnPos = networkState.clusterCenters[this.currentClusterIndex];

    let freeSlot = -1;
    for (let i = 0; i < MAX_SIGNALS; i++) {
      if (!networkState.signalActive[i]) {
        freeSlot = i;
        break;
      }
    }

    if (freeSlot === -1) {
      let maxRadiusVal = -1;
      let targetSlot = 0;
      for (let i = 0; i < MAX_SIGNALS; i++) {
        if (networkState.signals[i].w > maxRadiusVal) {
          maxRadiusVal = networkState.signals[i].w;
          targetSlot = i;
        }
      }
      freeSlot = targetSlot;
    }

    networkState.signalActive[freeSlot] = true;
    networkState.signals[freeSlot].set(spawnPos.x, spawnPos.y, spawnPos.z, 0.0);
  }
}
