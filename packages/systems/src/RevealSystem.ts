import { discoveryState } from '@cinematic-engine/core';
import { discoveryConfig } from '../../../apps/null-state/src/config/discovery';

export class RevealSystem {
  public name = 'RevealSystem';

  public update(_time: number, _delta: number): void {
    const curIdx = discoveryState.currentState;
    const tgtIdx = discoveryState.targetState;
    const progress = discoveryState.transitionProgress;

    const curCfg = discoveryConfig[curIdx];
    const tgtCfg = discoveryConfig[tgtIdx];

    if (!curCfg || !tgtCfg) return;

    // Linearly interpolate visual factors
    discoveryState.nodeSpeedMultiplier = this.lerp(curCfg.nodeSpeedMultiplier, tgtCfg.nodeSpeedMultiplier, progress);
    discoveryState.nodeOpacity = this.lerp(curCfg.nodeOpacity, tgtCfg.nodeOpacity, progress);
    discoveryState.connectionOpacity = this.lerp(curCfg.connectionOpacity, tgtCfg.connectionOpacity, progress);
    discoveryState.signalOpacity = this.lerp(curCfg.signalOpacity, tgtCfg.signalOpacity, progress);
    discoveryState.threatOpacity = this.lerp(curCfg.threatOpacity, tgtCfg.threatOpacity, progress);
  }

  private lerp(start: number, end: number, t: number): number {
    return (1.0 - t) * start + t * end;
  }
}
