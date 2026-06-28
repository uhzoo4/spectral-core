import { discoveryState, EventBus, networkState } from '@cinematic-engine/core';

export class DiscoverySystem {
  public name = 'DiscoverySystem';
  private scrollSpeed = 0.5;
  private lerpFactor = 5.0; // Inertia damping factor
  private lastMouseX = 0;
  private lastMouseY = 0;
  private interactionTimeout = 2.0; // Inactivity timeout in seconds
  private stateStep = 200; // 1000 maxScroll / 5 increments

  constructor() {
    this.setupListeners();
  }

  private setupListeners(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('wheel', this.handleWheel, { passive: true });
    window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    window.addEventListener('pointerdown', this.handlePointerDown, { passive: true });
  }

  private handleWheel = (e: WheelEvent): void => {
    discoveryState.scrollTarget = Math.max(
      0,
      Math.min(discoveryState.maxScroll, discoveryState.scrollTarget + e.deltaY * this.scrollSpeed)
    );
    discoveryState.lastInteractionTime = performance.now() / 1000;
  };

  private handleMouseMove = (e: MouseEvent): void => {
    const dx = e.clientX - this.lastMouseX;
    const dy = e.clientY - this.lastMouseY;
    const moved = Math.sqrt(dx * dx + dy * dy);

    if (moved > 1.0) {
      discoveryState.lastInteractionTime = performance.now() / 1000;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    }
  };

  private handlePointerDown = (): void => {
    discoveryState.lastInteractionTime = performance.now() / 1000;
  };

  public update(time: number, delta: number): void {
    // 1. Interpolate virtual scroll offset (inertia damping)
    const lerp = Math.min(1.0, delta * this.lerpFactor);
    discoveryState.scrollOffset += (discoveryState.scrollTarget - discoveryState.scrollOffset) * lerp;

    // 2. Track hover timers
    const timeSinceLastInteraction = time - discoveryState.lastInteractionTime;

    if (networkState.pointerActive && timeSinceLastInteraction < this.interactionTimeout) {
      discoveryState.dwellTime += delta;
      discoveryState.interactionTime += delta;
    } else {
      discoveryState.dwellTime = Math.max(0, discoveryState.dwellTime - delta * 0.5);
      discoveryState.interactionTime = Math.max(0, discoveryState.interactionTime - delta * 0.2);
    }

    // 3. Translate scroll and timers to state index
    const scrollState = Math.min(5, Math.floor(discoveryState.scrollOffset / this.stateStep));
    
    let timerState = 0;
    if (discoveryState.interactionTime > 15.0) {
      timerState = 5;
    } else if (discoveryState.interactionTime > 10.0) {
      timerState = 4;
    } else if (discoveryState.interactionTime > 6.0) {
      timerState = 3;
    } else if (discoveryState.interactionTime > 3.0) {
      timerState = 2;
    } else if (discoveryState.dwellTime > 0.5) {
      timerState = 1;
    }

    const target = Math.max(scrollState, timerState);

    // If timers achieved a higher state, jump scroll targets to match
    if (timerState > scrollState) {
      discoveryState.scrollTarget = Math.max(discoveryState.scrollTarget, timerState * this.stateStep);
    }

    // 4. Trigger state change
    if (target !== discoveryState.targetState) {
      discoveryState.currentState = discoveryState.targetState;
      discoveryState.targetState = target;
      discoveryState.transitionProgress = 0.0;
      
      EventBus.emit('DISCOVERY_STATE_CHANGED', {
        previous: discoveryState.currentState,
        current: discoveryState.targetState,
        time: time,
      });
    }

    // Smooth progress updates
    if (discoveryState.transitionProgress < 1.0) {
      discoveryState.transitionProgress = Math.min(1.0, discoveryState.transitionProgress + delta * 1.5);
    }
  }

  public dispose(): void {
    if (typeof window === 'undefined') return;
    window.removeEventListener('wheel', this.handleWheel);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('pointerdown', this.handlePointerDown);
  }
}
