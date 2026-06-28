import { discoveryState, emotionState, EventBus } from '@cinematic-engine/core';
import { emotionConfig } from '../../apps/null-state/src/config/emotion';

export class EmotionSystem {
  public name = 'EmotionSystem';

  constructor() {
    EventBus.on('DISCOVERY_STATE_CHANGED', this.handleDiscoveryChanged);
    this.syncTargetEmotion(0);
  }

  private handleDiscoveryChanged = (data: { current: number }): void => {
    this.syncTargetEmotion(data.current);
  };

  private syncTargetEmotion(discoveryIndex: number): void {
    const targetEmotionIdx = Math.min(5, Math.max(0, discoveryIndex));
    if (targetEmotionIdx !== emotionState.targetEmotion) {
      emotionState.currentEmotion = emotionState.targetEmotion;
      emotionState.targetEmotion = targetEmotionIdx;
      emotionState.transitionProgress = 0.0;
    }
  }

  public update(time: number, delta: number): void {
    // 1. Advance transition
    if (emotionState.transitionProgress < 1.0) {
      const tgtCfg = emotionConfig[emotionState.targetEmotion];
      const duration = tgtCfg ? tgtCfg.transitionDuration : 1.0;
      emotionState.transitionProgress = Math.min(1.0, emotionState.transitionProgress + delta / duration);
    }

    // 2. Perform property lerping
    const progress = emotionState.transitionProgress;
    const curCfg = emotionConfig[emotionState.currentEmotion];
    const tgtCfg = emotionConfig[emotionState.targetEmotion];

    if (!curCfg || !tgtCfg) return;

    // Linear interpolate colors
    emotionState.primaryColor.r = this.lerp(curCfg.primaryColor.r, tgtCfg.primaryColor.r, progress);
    emotionState.primaryColor.g = this.lerp(curCfg.primaryColor.g, tgtCfg.primaryColor.g, progress);
    emotionState.primaryColor.b = this.lerp(curCfg.primaryColor.b, tgtCfg.primaryColor.b, progress);

    emotionState.glowColor.r = this.lerp(curCfg.glowColor.r, tgtCfg.glowColor.r, progress);
    emotionState.glowColor.g = this.lerp(curCfg.glowColor.g, tgtCfg.glowColor.g, progress);
    emotionState.glowColor.b = this.lerp(curCfg.glowColor.b, tgtCfg.glowColor.b, progress);

    // Linear interpolate speeds & amplitudes
    emotionState.motionSpeed = this.lerp(curCfg.motionSpeed, tgtCfg.motionSpeed, progress);
    emotionState.motionJitter = this.lerp(curCfg.motionJitter, tgtCfg.motionJitter, progress);
    
    emotionState.cameraDriftScale = this.lerp(curCfg.cameraDriftScale, tgtCfg.cameraDriftScale, progress);
    emotionState.cameraDriftSpeed = this.lerp(curCfg.cameraDriftSpeed, tgtCfg.cameraDriftSpeed, progress);
    emotionState.cameraZoom = this.lerp(curCfg.cameraZoom, tgtCfg.cameraZoom, progress);
    emotionState.cameraParallax = this.lerp(curCfg.cameraParallax, tgtCfg.cameraParallax, progress);
    
    emotionState.signalInterval = this.lerp(curCfg.signalInterval, tgtCfg.signalInterval, progress);
    emotionState.uiOpacity = this.lerp(curCfg.uiOpacity, tgtCfg.uiOpacity, progress);

    // Select text typography details at midpoint boundary
    if (progress > 0.5) {
      emotionState.letterSpacing = tgtCfg.letterSpacing;
      emotionState.fontWeight = tgtCfg.fontWeight;
    } else {
      emotionState.letterSpacing = curCfg.letterSpacing;
      emotionState.fontWeight = curCfg.fontWeight;
    }
  }

  private lerp(start: number, end: number, t: number): number {
    return (1.0 - t) * start + t * end;
  }

  public dispose(): void {
    EventBus.off('DISCOVERY_STATE_CHANGED', this.handleDiscoveryChanged);
  }
}
