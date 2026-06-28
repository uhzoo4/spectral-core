import { networkState } from '@cinematic-engine/core';

export class InteractionSystem {
  public name = 'InteractionSystem';

  public update(_time: number, _delta: number): void {
    // Tracks basic pointer state triggers
    if (networkState.pointerActive) {
      networkState.pointerActive = true;
    }
  }
}
