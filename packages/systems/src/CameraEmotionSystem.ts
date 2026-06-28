import { Camera } from 'three';
import { emotionState, networkState } from '@cinematic-engine/core';

export class CameraEmotionSystem {
  public name = 'CameraEmotionSystem';
  private camera: Camera | null = null;
  private basePosition = { x: 0, y: 0, z: 20 };

  constructor(camera?: Camera) {
    if (camera) {
      this.setCamera(camera);
    }
  }

  public setCamera(camera: Camera): void {
    this.camera = camera;
    this.basePosition.x = camera.position.x;
    this.basePosition.y = camera.position.y;
    this.basePosition.z = camera.position.z;
  }

  public update(time: number, delta: number): void {
    if (!this.camera) return;

    const driftScale = emotionState.cameraDriftScale;
    const driftSpeed = emotionState.cameraDriftSpeed;
    const zoomLevel = emotionState.cameraZoom;
    const parallaxFactor = emotionState.cameraParallax;

    // 1. Lissajous organic drift offsets
    const t = time * driftSpeed;
    const driftX = Math.sin(t) * Math.cos(t * 0.75) * driftScale;
    const driftY = Math.sin(t * 1.3 + 1.2) * Math.cos(t * 0.5) * driftScale;

    // 2. Cursor parallax pull
    let parallaxX = 0;
    let parallaxY = 0;
    if (networkState.pointerActive) {
      parallaxX = networkState.pointerPos.x * parallaxFactor * 0.15;
      parallaxY = networkState.pointerPos.y * parallaxFactor * 0.15;
    }

    // 3. Smooth camera easing
    const targetX = this.basePosition.x + driftX + parallaxX;
    const targetY = this.basePosition.y + driftY + parallaxY;
    const targetZ = this.basePosition.z / zoomLevel;

    const ease = Math.min(1.0, delta * 3.5);
    this.camera.position.x += (targetX - this.camera.position.x) * ease;
    this.camera.position.y += (targetY - this.camera.position.y) * ease;
    this.camera.position.z += (targetZ - this.camera.position.z) * ease;
    
    // Maintain focus towards center
    this.camera.lookAt(0, 0, 0);
  }
}
