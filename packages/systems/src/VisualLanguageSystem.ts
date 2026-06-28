import { emotionState } from '@cinematic-engine/core';

export class VisualLanguageSystem {
  public name = 'VisualLanguageSystem';
  private lastUiOpacity = -1;
  private lastLetterSpacing = '';
  private lastFontWeight = '';
  private lastR = -1;
  private lastG = -1;
  private lastB = -1;

  public update(time: number, delta: number): void {
    if (typeof document === 'undefined') return;
    
    const hud = document.getElementById('narrative-telemetry-hud');
    
    if (hud) {
      const opacity = emotionState.uiOpacity;
      const spacing = emotionState.letterSpacing;
      const weight = emotionState.fontWeight;

      // 1. Direct CSS updates with caching checks to prevent DOM thrashing
      if (opacity !== this.lastUiOpacity) {
        hud.style.opacity = opacity.toString();
        this.lastUiOpacity = opacity;
      }
      
      if (spacing !== this.lastLetterSpacing) {
        hud.style.letterSpacing = spacing;
        this.lastLetterSpacing = spacing;
      }
      
      if (weight !== this.lastFontWeight) {
        hud.style.fontWeight = weight;
        this.lastFontWeight = weight;
      }

      // Convert float RGB configurations (0.0 - 1.0) to standard CSS integers
      const r = Math.round(emotionState.primaryColor.r * 255);
      const g = Math.round(emotionState.primaryColor.g * 255);
      const b = Math.round(emotionState.primaryColor.b * 255);

      if (r !== this.lastR || g !== this.lastG || b !== this.lastB) {
        hud.style.color = `rgb(${r}, ${g}, ${b})`;
        hud.style.textShadow = `0 0 4px rgba(${r}, ${g}, ${b}, 0.5)`;
        this.lastR = r;
        this.lastG = g;
        this.lastB = b;
      }
    }
  }
}
