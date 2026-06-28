export type InteractionStage = 'notice' | 'acknowledge' | 'respond' | 'settle' | 'idle';

export interface StagePreset {
  stage: InteractionStage;
  motionMultiplier: number;
  focalAmplification: number;
  driftMultiplier: number;
  lerpRate: number;
}

export const interactionPresets: Record<InteractionStage, StagePreset> = {
  idle: {
    stage: 'idle',
    motionMultiplier: 1.0,
    focalAmplification: 1.0,
    driftMultiplier: 1.0,
    lerpRate: 2.0,
  },
  notice: {
    stage: 'notice',
    motionMultiplier: 0.2, // Hesitation phase
    focalAmplification: 0.8,
    driftMultiplier: 0.1,
    lerpRate: 10.0,
  },
  acknowledge: {
    stage: 'acknowledge',
    motionMultiplier: 0.6,
    focalAmplification: 1.2,
    driftMultiplier: 0.5,
    lerpRate: 4.0,
  },
  respond: {
    stage: 'respond',
    motionMultiplier: 1.1, // Peak reaction
    focalAmplification: 1.5,
    driftMultiplier: 1.2,
    lerpRate: 3.0,
  },
  settle: {
    stage: 'settle',
    motionMultiplier: 0.8,
    focalAmplification: 1.0,
    driftMultiplier: 0.9,
    lerpRate: 1.5,
  },
};
