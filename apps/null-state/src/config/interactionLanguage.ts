export interface InteractionLanguageConfig {
  hoverAttractionRadius: number;
  hoverLeanStrength: number;
  scrollFastThreshold: number;
  scrollDampOpacityFactor: number;
  
  // Timing intervals (in seconds) for the Notice -> Acknowledge -> Respond -> Settle loop
  noticeDuration: number;
  acknowledgeDuration: number;
  respondDuration: number;
  settleDuration: number;
}

export const interactionLanguageConfig: InteractionLanguageConfig = {
  hoverAttractionRadius: 8.0,
  hoverLeanStrength: 0.22,
  scrollFastThreshold: 15.0,
  scrollDampOpacityFactor: 0.15,
  
  noticeDuration: 0.1,
  acknowledgeDuration: 0.35,
  respondDuration: 0.6,
  settleDuration: 1.2,
};
