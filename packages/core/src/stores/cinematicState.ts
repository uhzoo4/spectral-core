import { Vector3 } from 'three';

export interface CinematicState {
  timelineProgress: number; // Normalized 0.0 - 1.0 scroll progress
  currentActIndex: number;
  currentActName: string;
  
  // Eased visual factors
  breathMultiplier: number; // 0.0 - 1.0 breathing wave
  focusPosition: Vector3;
  focusRadius: number;

  // Visual lock status
  isNarrativeTyping: boolean;
}

export const cinematicState: CinematicState = {
  timelineProgress: 0.0,
  currentActIndex: 0,
  currentActName: 'Silence',
  
  breathMultiplier: 1.0,
  focusPosition: new Vector3(0, 0, 0),
  focusRadius: 4.0,

  isNarrativeTyping: false,
};
