import { networkState } from '@cinematic-engine/core';

export interface ClusterSystemConfig {
  count: number;
  driftSpeed: number;
  wanderFrequency: number;
  wanderScale: number;
  baseRadius: number;
}

export class ClusterSystem {
  public name = 'ClusterSystem';
  private config: ClusterSystemConfig;

  constructor(config?: Partial<ClusterSystemConfig>) {
    this.config = {
      count: 8,
      driftSpeed: 0.15,
      wanderFrequency: 0.5,
      wanderScale: 2.0,
      baseRadius: 10.0,
      ...config,
    };
    networkState.clusterCounts = this.config.count;
    this.initializeClusters();
  }

  private initializeClusters(): void {
    const count = this.config.count;
    const radius = this.config.baseRadius;
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius;
      const z = (Math.random() - 0.5) * 2.0;

      networkState.clusterBases[i].set(x, y, z);
      networkState.clusterCenters[i].copy(networkState.clusterBases[i]);
    }
  }

  public update(time: number, delta: number): void {
    const count = this.config.count;
    const speed = this.config.driftSpeed;
    const freq = this.config.wanderFrequency;
    const scale = this.config.wanderScale;

    for (let i = 0; i < count; i++) {
      const base = networkState.clusterBases[i];
      const center = networkState.clusterCenters[i];

      const t = time * speed + i * 17.3;
      const dx = Math.sin(t * freq) * Math.cos(t * freq * 0.7) * scale;
      const dy = Math.sin(t * freq * 1.3 + 2.0) * Math.cos(t * freq * 0.5) * scale;
      const dz = Math.cos(t * freq * 0.9 - 1.0) * scale;

      center.set(base.x + dx, base.y + dy, base.z + dz);
    }
  }
}
