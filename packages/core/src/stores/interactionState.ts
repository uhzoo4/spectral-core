import { InteractionStage } from '../../../../apps/null-state/src/interaction/InteractionPresets';

export interface InteractionState {
  currentStage: InteractionStage;
  targetStage: InteractionStage;
  stageProgress: number; // 0.0 - 1.0
  stageTimer: number;

  // Scroll dynamics
  scrollSpeed: number;
  scrollReadingFactor: number; // 0.0 = fast scroll (visual suppression), 1.0 = slow (full immersion)

  // Real-time Visual Multipliers (lerped dynamically by systems)
  motionMultiplier: number;
  focalAmplification: number;
  driftMultiplier: number;
  lerpRate: number;
  hoverIntensity: number;
}

export const interactionState: InteractionState = {
  currentStage: 'idle',
  targetStage: 'idle',
  stageProgress: 1.0,
  stageTimer: 0,

  scrollSpeed: 0,
  scrollReadingFactor: 1.0,

  motionMultiplier: 1.0,
  focalAmplification: 1.0,
  driftMultiplier: 1.0,
  lerpRate: 2.0,
  hoverIntensity: 0.0,
};
