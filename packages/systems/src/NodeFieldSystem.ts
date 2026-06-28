import { networkState, emotionState, cinematicState, interactionState } from '@cinematic-engine/core';
import { EnvironmentalCompositionSystem } from './EnvironmentalCompositionSystem';

export interface NodeObject {
  x: number;
  y: number;
  z: number;
  scale: number;
  intensity: number;
}

export class NodeFieldSystem {
  public name = 'NodeFieldSystem';
  
  public nodeCount: number;
  public positions: Float32Array;
  public velocities: Float32Array;
  public nodes: NodeObject[];
  
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
    
    // Pre-allocate NodeObjects to prevent garbage collection spikes
    this.nodes = Array.from({ length: count }, () => ({
      x: 0,
      y: 0,
      z: 0,
      scale: 0.08 + Math.random() * 0.12,
      intensity: 0.5 + Math.random() * 0.5,
    }));
    
    this.initializeNodes();
  }

  public getActiveCount(): number {
    return this.nodeCount;
  }

  private initializeNodes(): void {
    const count = this.nodeCount;
    const clusterCounts = networkState.clusterCounts || 8;
    const composition = new EnvironmentalCompositionSystem();
    const tempPos = { x: 0, y: 0, z: 0 };

    for (let i = 0; i < count; i++) {
      const clusterIdx = i % clusterCounts;
      this.clusterIndices[i] = clusterIdx;
      
      composition.composeNode(i, count, tempPos);
      const center = networkState.clusterCenters[clusterIdx];

      this.clusterOffsets[i * 3 + 0] = tempPos.x - center.x;
      this.clusterOffsets[i * 3 + 1] = tempPos.y - center.y;
      this.clusterOffsets[i * 3 + 2] = tempPos.z - center.z;

      this.positions[i * 3 + 0] = tempPos.x;
      this.positions[i * 3 + 1] = tempPos.y;
      this.positions[i * 3 + 2] = tempPos.z;
      
      const node = this.nodes[i];
      node.x = this.positions[i * 3 + 0];
      node.y = this.positions[i * 3 + 1];
      node.z = this.positions[i * 3 + 2];
    }
  }

  public update(_time: number, delta: number): void {
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
      const rzVal = (Math.random() - 0.5) * jitter;

      const nextVelX = velX + (forceX * speedScale + rx) * delta;
      const nextVelY = velY + (forceY * speedScale + ry) * delta;
      const nextVelZ = velZ + (forceZ * speedScale + rzVal) * delta;

      this.velocities[i * 3 + 0] = nextVelX;
      this.velocities[i * 3 + 1] = nextVelY;
      this.velocities[i * 3 + 2] = nextVelZ;

      this.positions[i * 3 + 0] += nextVelX * interactiveMultiplier * delta;
      this.positions[i * 3 + 1] += nextVelY * interactiveMultiplier * delta;
      this.positions[i * 3 + 2] += nextVelZ * interactiveMultiplier * delta;
      
      const node = this.nodes[i];
      node.x = this.positions[i * 3 + 0];
      node.y = this.positions[i * 3 + 1];
      node.z = this.positions[i * 3 + 2];
    }
  }
}
