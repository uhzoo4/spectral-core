import { EventBus } from '@cinematic-engine/core';
import { discoveryConfig } from '../../apps/null-state/src/config/discovery';

export class NarrativeSystem {
  public name = 'NarrativeSystem';
  private container: HTMLDivElement | null = null;
  private currentLogs: string[] = [];
  private currentLogIndex = 0;
  private currentText = '';
  private charIndex = 0;
  private typingTimer = 0.0;
  private charDelay = 0.035; // Typewriter speed (seconds per character)
  private lineDelay = 1.2; // Pause between log lines

  constructor() {
    this.createHUDElement();
    EventBus.on('DISCOVERY_STATE_CHANGED', this.handleStateChanged);
    this.loadStateLogs(0);
  }

  private createHUDElement(): void {
    if (typeof document === 'undefined') return;

    let hud = document.getElementById('narrative-telemetry-hud') as HTMLDivElement;
    if (!hud) {
      hud = document.createElement('div') as HTMLDivElement;
      hud.id = 'narrative-telemetry-hud';
      
      hud.style.position = 'fixed';
      hud.style.bottom = '40px';
      hud.style.left = '40px';
      hud.style.fontFamily = '"Courier New", Courier, monospace, sans-serif';
      hud.style.fontSize = '11px';
      hud.style.lineHeight = '1.6';
      hud.style.color = '#00ffd5';
      hud.style.zIndex = '9999';
      hud.style.pointerEvents = 'none';
      hud.style.textShadow = '0 0 4px rgba(0, 255, 213, 0.4)';
      hud.style.opacity = '0.85';
      hud.style.letterSpacing = '1px';
      hud.style.transition = 'color 0.5s ease';

      // Insert blinking cursor CSS animation to head if not present
      if (!document.getElementById('hud-blink-style')) {
        const style = document.createElement('style');
        style.id = 'hud-blink-style';
        style.innerHTML = `
          @keyframes hud-blink {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
          }
        `;
        document.head.appendChild(style);
      }

      document.body.appendChild(hud);
    }
    this.container = hud;
  }

  private handleStateChanged = (data: { previous: number; current: number }): void => {
    this.loadStateLogs(data.current);

    if (this.container) {
      if (data.current >= 3) {
        this.container.style.color = '#ff3344'; // Anomaly Alarm Red
        this.container.style.textShadow = '0 0 5px rgba(255, 51, 68, 0.6)';
      } else {
        this.container.style.color = '#00ffd5'; // Standard Cyber Cyan
        this.container.style.textShadow = '0 0 4px rgba(0, 255, 213, 0.4)';
      }
    }
  };

  private loadStateLogs(stateIdx: number): void {
    const config = discoveryConfig[stateIdx];
    if (!config) return;

    this.currentLogs = config.telemetryLogs;
    this.currentLogIndex = 0;
    this.charIndex = 0;
    this.currentText = '';
    this.typingTimer = 0.0;
  }

  public update(time: number, delta: number): void {
    if (!this.container || this.currentLogs.length === 0) return;

    this.typingTimer += delta;

    const currentLine = this.currentLogs[this.currentLogIndex];
    if (!currentLine) return;

    if (this.charIndex < currentLine.length) {
      if (this.typingTimer >= this.charDelay) {
        this.typingTimer = 0;
        this.currentText += currentLine[this.charIndex];
        this.charIndex++;
        
        this.container.innerHTML = `&gt; ${this.currentText}<span style="animation: hud-blink 0.8s step-end infinite;">_</span>`;
      }
    } else {
      if (this.typingTimer >= this.lineDelay) {
        this.typingTimer = 0;
        this.currentLogIndex++;
        this.charIndex = 0;
        
        if (this.currentLogIndex < this.currentLogs.length) {
          this.currentText = '';
        } else {
          this.container.innerHTML = `&gt; ${currentLine}<span style="opacity: 0.4;">_</span>`;
        }
      }
    }
  }

  public dispose(): void {
    EventBus.off('DISCOVERY_STATE_CHANGED', this.handleStateChanged);
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
