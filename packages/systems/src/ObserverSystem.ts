import { Vector3 } from 'three';
import { networkState } from '@cinematic-engine/core';

export interface ObserverSystemConfig {
  attractionRadius: number;
  attractionStrength: number;
}

export class ObserverSystem {
  public name = 'ObserverSystem';
  private config: ObserverSystemConfig;
  private lastPointerPos = new Vector3();

  constructor(config?: Partial<ObserverSystemConfig>) {
    this.config = {
      attractionRadius: 15.0,
      attractionStrength: 0.35,
      ...config,
    };
  }

  public update(time: number, delta: number): void {
    if (!networkState.pointerActive) {
      networkState.pointerSpeed = 0;
      return;
    }

    const distance = networkState.pointerPos.distanceTo(this.lastPointerPos);
    
    const dtFactor = Math.min(1.0, delta * 10.0);
    const speed = delta > 0 ? distance / delta : 0;
    networkState.pointerSpeed += (speed - networkState.pointerSpeed) * dtFactor;
    
    this.lastPointerPos.copy(networkState.pointerPos);

    const count = networkState.clusterCounts;
    const attrRadius = this.config.attractionRadius;
    const attrStrength = this.config.attractionStrength;

    for (let i = 0; i < count; i++) {
      const center = networkState.clusterCenters[i];
      const distToPointer = center.distanceTo(networkState.pointerPos);
      
      if (distToPointer < attrRadius) {
        const t = 1.0 - distToPointer / attrRadius;
        
        const pullX = (networkState.pointerPos.x - center.x) * attrStrength * t * dtFactor;
        const pullY = (networkState.pointerPos.y - center.y) * attrStrength * t * dtFactor;
        const pullZ = (networkState.pointerPos.z - center.z) * attrStrength * t * dtFactor;
        
        center.x += pullX;
        center.y += pullY;
        center.z += pullZ;
      }
    }
  }
}
