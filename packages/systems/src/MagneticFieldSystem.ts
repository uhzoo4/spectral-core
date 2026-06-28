import { networkState, interactionState } from '@cinematic-engine/core';
import { interactionLanguageConfig } from '../../../apps/null-state/src/config/interactionLanguage';

export class MagneticFieldSystem {
  public name = 'MagneticFieldSystem';

  public update(_time: number, delta: number): void {
    if (!networkState.pointerActive) {
      interactionState.hoverIntensity = 0.0;
      return;
    }

    const count = networkState.clusterCounts;
    const radius = interactionLanguageConfig.hoverAttractionRadius;
    const lean = interactionLanguageConfig.hoverLeanStrength;
    const activeMultiplier = interactionState.motionMultiplier;

    let totalIntensity = 0.0;

    for (let i = 0; i < count; i++) {
      const center = networkState.clusterCenters[i];
      const dist = center.distanceTo(networkState.pointerPos);

      if (dist < radius) {
        // Calculate localized proximity (1.0 at center, 0.0 at radius edge)
        const intensity = 1.0 - dist / radius;
        totalIntensity = Math.max(totalIntensity, intensity);

        // Apply visual lean pull vector: orient clusters target position slightly to cursor coordinate
        // Formula: center += (pointerPos - center) * leanStrength * intensity * activeStageMultiplier
        const ease = Math.min(1.0, delta * 5.0);
        const pullX = (networkState.pointerPos.x - center.x) * lean * intensity * activeMultiplier * ease;
        const pullY = (networkState.pointerPos.y - center.y) * lean * intensity * activeMultiplier * ease;
        const pullZ = (networkState.pointerPos.z - center.z) * lean * intensity * activeMultiplier * ease;

        center.x += pullX;
        center.y += pullY;
        center.z += pullZ;
      }
    }

    // Update global store proximity status
    const rate = delta * 4.0;
    interactionState.hoverIntensity += (totalIntensity - interactionState.hoverIntensity) * Math.min(1.0, rate);
  }
}
