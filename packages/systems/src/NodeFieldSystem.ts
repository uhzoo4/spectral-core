import { networkState, emotionState, cinematicState, interactionState } from '@cinematic-engine/core';

export class NodeFieldSystem {
  public name = 'NodeFieldSystem';
  
  public nodeCount: number;
  public positions: Float32Array;
  public velocities: Float32Array;
  
  private clusterIndices: Uint16Array;
  private clusterOffsets: Float32Array;
  
  private springTension = 18.0;
  private friction = 2.8;

  constructor(count = 2000) {
    this.nodeCount = count;
    this.positions = new Float32Array(count * 3);
    this.velocities = new Float32Array(count * 3);
    this.clusterIndices = new Uint16Array(count);
    this.clusterOffsets = new Float32Array(count * 3);
    
    this.initializeNodes();
  }

  private initializeNodes(): void {
    const count = this.nodeCount;
    const clusterCounts = networkState.clusterCounts || 8;

    for (let i = 0; i < count; i++) {
      const clusterIdx = i % clusterCounts;
      this.clusterIndices[i] = clusterIdx;
      
      const clusterBase = networkState.clusterBases[clusterIdx];

      const rx = (Math.random() - 0.5) * 8.0;
      const ry = (Math.random() - 0.5) * 8.0;
      const rz = (Math.random() - 0.5) * 3.0;

      this.clusterOffsets[i * 3 + 0] = rx;
      this.clusterOffsets[i * 3 + 1] = ry;
      this.clusterOffsets[i * 3 + 2] = rz;

      this.positions[i * 3 + 0] = clusterBase.x + rx;
      this.positions[i * 3 + 1] = clusterBase.y + ry;
      this.positions[i * 3 + 2] = clusterBase.z + rz;
    }
  }

  public update(time: number, delta: number): void {
    const count = this.nodeCount;
    const speedScale = emotionState.motionSpeed * (0.8 + cinematicState.breathMultiplier * 0.4);
    const jitter = emotionState.motionJitter * cinematicState.breathMultiplier;
    const interactiveMultiplier = interactionState.motionMultiplier;

    for (let i = 0; i < count; i++) {
      const clusterIdx = this.clusterIndices[i];
      const center = networkState.clusterCenters[clusterIdx];

      const targetX = center.x + this.clusterOffsets[i * 3 + 0];
      const targetY = center.y + this.clusterOffsets[i * 3 + 1];
      const targetZ = center.z + this.clusterOffsets[i * 3 + 2];

      const posX = this.positions[i * 3 + 0];
      const posY = this.positions[i * 3 + 1];
      const posZ = this.positions[i * 3 + 2];

      const velX = this.velocities[i * 3 + 0];
      const velY = this.velocities[i * 3 + 1];
      const velZ = this.velocities[i * 3 + 2];

      const forceX = (targetX - posX) * this.springTension - velX * this.friction;
      const forceY = (targetY - posY) * this.springTension - velY * this.friction;
      const forceZ = (targetZ - posZ) * this.springTension - velZ * this.friction;

      const rx = (Math.random() - 0.5) * jitter;
      const ry = (Math.random() - 0.5) * jitter;
      const rz = (Math.random() - 0.5) * rz;

      const nextVelX = velX + (forceX * speedScale + rx) * delta;
      const nextVelY = velY + (forceY * speedScale + ry) * delta;
      const nextVelZ = velZ + (forceZ * speedScale + rz) * delta;

      this.velocities[i * 3 + 0] = nextVelX;
      this.velocities[i * 3 + 1] = nextVelY;
      this.velocities[i * 3 + 2] = nextVelZ;

      this.positions[i * 3 + 0] += nextVelX * interactiveMultiplier * delta;
      this.positions[i * 3 + 1] += nextVelY * interactiveMultiplier * delta;
      this.positions[i * 3 + 2] += nextVelZ * interactiveMultiplier * delta;
    }
  }
}
