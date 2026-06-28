import { interactionState, EventBus, networkState } from '@cinematic-engine/core';
import { interactionPresets, InteractionStage } from '../../../apps/null-state/src/interaction/InteractionPresets';
import { interactionLanguageConfig } from '../../../apps/null-state/src/config/interactionLanguage';

export class InteractionLanguageSystem {
  public name = 'InteractionLanguageSystem';

  constructor() {
    this.syncTargetStage('idle');
  }

  public syncTargetStage(target: InteractionStage): void {
    if (interactionState.targetStage !== target) {
      interactionState.currentStage = interactionState.targetStage;
      interactionState.targetStage = target;
      interactionState.stageProgress = 0.0;
      interactionState.stageTimer = 0.0;

      EventBus.emit('INTERACTION_STAGE_CHANGED', {
        previous: interactionState.currentStage,
        current: interactionState.targetStage,
      });
    }
  }

  public update(_time: number, delta: number): void {
    const hasPointer = networkState.pointerActive;
    const ptrSpeed = networkState.pointerSpeed;
    const current = interactionState.targetStage;

    interactionState.stageTimer += delta;

    // 1. Stage triggers
    if (current === 'idle') {
      if (hasPointer && ptrSpeed > 0.05) {
        this.syncTargetStage('notice');
      }
    } else if (current === 'notice') {
      if (interactionState.stageTimer >= interactionLanguageConfig.noticeDuration) {
        this.syncTargetStage('acknowledge');
      }
    } else if (current === 'acknowledge') {
      if (interactionState.stageTimer >= interactionLanguageConfig.acknowledgeDuration) {
        this.syncTargetStage('respond');
      }
    } else if (current === 'respond') {
      if (!hasPointer || ptrSpeed < 0.02) {
        this.syncTargetStage('settle');
      }
    } else if (current === 'settle') {
      if (interactionState.stageTimer >= interactionLanguageConfig.settleDuration) {
        this.syncTargetStage('idle');
      } else if (hasPointer && ptrSpeed > 0.1) {
        this.syncTargetStage('notice');
      }
    }

    // 2. Interpolate progression
    if (interactionState.stageProgress < 1.0) {
      const rate = interactionPresets[interactionState.targetStage].lerpRate;
      interactionState.stageProgress = Math.min(1.0, interactionState.stageProgress + delta * rate);
    }

    const progress = interactionState.stageProgress;
    const curPreset = interactionPresets[interactionState.currentStage];
    const tgtPreset = interactionPresets[interactionState.targetStage];

    if (curPreset && tgtPreset) {
      interactionState.motionMultiplier = this.lerp(curPreset.motionMultiplier, tgtPreset.motionMultiplier, progress);
      interactionState.focalAmplification = this.lerp(curPreset.focalAmplification, tgtPreset.focalAmplification, progress);
      interactionState.driftMultiplier = this.lerp(curPreset.driftMultiplier, tgtPreset.driftMultiplier, progress);
    }
  }

  private lerp(start: number, end: number, t: number): number {
    return (1.0 - t) * start + t * end;
  }
}
