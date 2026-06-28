import { discoveryState, interactionState } from '@cinematic-engine/core';
import { interactionLanguageConfig } from '../../apps/null-state/src/config/interactionLanguage';

export class InteractionTimelineSystem {
  public name = 'InteractionTimelineSystem';
  private lastScrollOffset = 0;

  public update(time: number, delta: number): void {
    if (delta <= 0) return;

    // 1. Calculate active scroll velocity
    const currentOffset = discoveryState.scrollOffset;
    const speed = Math.abs(currentOffset - this.lastScrollOffset) / delta;
    
    const easeRate = Math.min(1.0, delta * 5.0);
    interactionState.scrollSpeed += (speed - interactionState.scrollSpeed) * easeRate;
    this.lastScrollOffset = currentOffset;

    // 2. Translate velocity to suppression weights
    const threshold = interactionLanguageConfig.scrollFastThreshold;
    const minDamp = interactionLanguageConfig.scrollDampOpacityFactor;

    let targetFactor = 1.0;
    if (interactionState.scrollSpeed > threshold) {
      const excess = (interactionState.scrollSpeed - threshold) / 100.0;
      targetFactor = Math.max(minDamp, 1.0 - excess);
    }

    const lerpRate = Math.min(1.0, delta * 3.5);
    interactionState.scrollReadingFactor += (targetFactor - interactionState.scrollReadingFactor) * lerpRate;
  }
}
