import { cinematicState, discoveryState, networkState } from '@cinematic-engine/core';
import { spaceConfig } from '../../../apps/null-state/src/config/space';
import { Vector3 } from 'three';

export class SpatialDirector {
  public name = 'SpatialDirector';

  private currentPos = new Vector3(0, 0, 20);
  private targetPos = new Vector3(0, 0, 20);
  private velocity = new Vector3(0, 0, 0);

  public update(time: number, delta: number): void {
    const config = spaceConfig;

    // 1. Calculate base lissajous tracking coordinates
    const freq = config.cameraTrackFrequency;
    const lissX = Math.sin(time * freq) * Math.cos(time * freq * 0.75) * config.cameraTrackAmplitude.x;
    const lissY = Math.sin(time * freq * 1.3 + 1.2) * Math.cos(time * freq * 0.5) * config.cameraTrackAmplitude.y;
    const lissZ = Math.cos(time * freq * 0.9) * config.cameraTrackAmplitude.z;

    // 2. Incorporate scroll zoom (push-in)
    const scrollZOffset = discoveryState.scrollOffset * config.cameraScrollZoomSpeed;
    const baseZ = config.cameraBasePos.z - scrollZOffset;

    // 3. Incorporate cursor parallax translation
    let parallaxX = 0;
    let parallaxY = 0;
    if (networkState.pointerActive) {
      // Normalize pointer coordinate pulls
      parallaxX = (networkState.pointerPos.x / 10.0) * config.mouseParallaxStrength;
      parallaxY = (networkState.pointerPos.y / 10.0) * config.mouseParallaxStrength;
    }

    // Set absolute target position
    this.targetPos.set(
      config.cameraBasePos.x + lissX + parallaxX,
      config.cameraBasePos.y + lissY + parallaxY,
      Math.max(8.0, baseZ + lissZ) // Clamp near plane to avoid clipping nodes
    );

    // 4. Easing with a viscous spring physics solver (0 memory allocations)
    const dt = Math.min(0.1, delta); // Cap delta time to prevent spring explosions in lag spikes
    
    // spring equation: F = -k * x - c * v
    const forceX = -config.springStiffness * (this.currentPos.x - this.targetPos.x) - config.springDamping * this.velocity.x;
    const forceY = -config.springStiffness * (this.currentPos.y - this.targetPos.y) - config.springDamping * this.velocity.y;
    const forceZ = -config.springStiffness * (this.currentPos.z - this.targetPos.z) - config.springDamping * this.velocity.z;

    this.velocity.x += forceX * dt;
    this.velocity.y += forceY * dt;
    this.velocity.z += forceZ * dt;

    this.currentPos.x += this.velocity.x * dt;
    this.currentPos.y += this.velocity.y * dt;
    this.currentPos.z += this.velocity.z * dt;

    // Update global state coordinate
    cinematicState.cameraPosition.copy(this.currentPos);
  }
}
