import { discoveryState, interactionState, cinematicState } from '@cinematic-engine/core';

export class FocusAttentionSystem {
  public name = 'FocusAttentionSystem';

  public update(time: number, delta: number): void {
    // Scale active focal boundaries based on interactive amplification factors
    const amp = interactionState.focalAmplification;
    cinematicState.focusRadius *= amp;

    // Damp node opacities during fast scroll moves to draw maximum focus to typography logs
    const factor = interactionState.scrollReadingFactor;
    discoveryState.nodeOpacity *= (0.2 + factor * 0.8);
    discoveryState.connectionOpacity *= (0.1 + factor * 0.9);
  }
}
