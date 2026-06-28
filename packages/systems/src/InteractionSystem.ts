import { networkState } from '@cinematic-engine/core';

export class InteractionSystem {
  public name = 'InteractionSystem';

  public update(time: number, delta: number): void {
    // Tracks basic pointer state triggers
    if (networkState.pointerActive) {
      networkState.pointerActive = true;
    }
  }
}
