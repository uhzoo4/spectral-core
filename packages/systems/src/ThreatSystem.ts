import { networkState, MAX_THREATS, EventBus } from '@cinematic-engine/core';

export interface ThreatSystemConfig {
  spawnInterval: number;
  lifetime: number;
  radius: number;
  glitchIntensity: number;
}

export class ThreatSystem {
  public name = 'ThreatSystem';
  private config: ThreatSystemConfig;
  private spawnTimer = 0;

  constructor(config?: Partial<ThreatSystemConfig>) {
    this.config = {
      spawnInterval: 8.0,
      lifetime: 5.0,
      radius: 6.0,
      glitchIntensity: 0.8,
      ...config,
    };
  }

  public update(time: number, delta: number): void {
    // 1. Decay and update active threat zones
    for (let i = 0; i < MAX_THREATS; i++) {
      if (networkState.threatActive[i]) {
        networkState.threatLifetimes[i] -= delta;
        const remaining = networkState.threatLifetimes[i];

        if (remaining <= 0) {
          networkState.threatActive[i] = false;
          networkState.threats[i].set(0, 0, 0, 0);
        } else {
          const normLifetime = remaining / this.config.lifetime;
          const flicker = 0.8 + 0.2 * Math.sin(time * 50.0);
          const intensity = normLifetime * flicker * this.config.glitchIntensity;
          
          networkState.threats[i].w = intensity;
        }
      }
    }

    // 2. Spawning logic
    this.spawnTimer += delta;
    if (this.spawnTimer >= this.config.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnThreat();
    }
  }

  public spawnThreat(): void {
    const clusterCount = networkState.clusterCounts;
    if (clusterCount <= 0) return;

    const clusterIdx = Math.floor(Math.random() * clusterCount);
    const clusterPos = networkState.clusterCenters[clusterIdx];

    let slot = -1;
    for (let i = 0; i < MAX_THREATS; i++) {
      if (!networkState.threatActive[i]) {
        slot = i;
        break;
      }
    }

    if (slot === -1) {
      let minLife = Infinity;
      for (let i = 0; i < MAX_THREATS; i++) {
        if (networkState.threatLifetimes[i] < minLife) {
          minLife = networkState.threatLifetimes[i];
          slot = i;
        }
      }
    }

    if (slot !== -1) {
      networkState.threatActive[slot] = true;
      networkState.threatLifetimes[slot] = this.config.lifetime;
      networkState.threatRadii[slot] = this.config.radius;
      
      const offsetX = (Math.random() - 0.5) * 5.0;
      const offsetY = (Math.random() - 0.5) * 5.0;
      const offsetZ = (Math.random() - 0.5) * 2.0;

      const posX = clusterPos.x + offsetX;
      const posY = clusterPos.y + offsetY;
      const posZ = clusterPos.z + offsetZ;

      networkState.threats[slot].set(
        posX,
        posY,
        posZ,
        this.config.glitchIntensity
      );

      // Emit event via central EventBus
      EventBus.emit('THREAT_DETECTED', {
        id: slot,
        position: [posX, posY, posZ],
        timestamp: Date.now()
      });
    }
  }
}
