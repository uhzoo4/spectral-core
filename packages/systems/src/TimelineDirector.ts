import { discoveryState, cinematicState, EventBus } from '@cinematic-engine/core';
import { cinematicConfig } from '../../../apps/null-state/src/config/cinematicDirection';

export class TimelineDirector {
  public name = 'TimelineDirector';

  constructor() {
    EventBus.on('NARRATIVE_TYPING_START', this.handleTypingStart);
    EventBus.on('NARRATIVE_TYPING_END', this.handleTypingEnd);
  }

  private handleTypingStart = (): void => {
    cinematicState.isNarrativeTyping = true;
  };

  private handleTypingEnd = (): void => {
    cinematicState.isNarrativeTyping = false;
  };

  public update(time: number, delta: number): void {
    // 1. Viscous magnetic scroll lock
    if (cinematicState.isNarrativeTyping) {
      // Heavily damp the scroll target back to current offset to prevent rapid skipping
      discoveryState.scrollTarget += (discoveryState.scrollOffset - discoveryState.scrollTarget) * Math.min(1.0, delta * 7.5);
    }

    // 2. Normalize scroll to timeline progress
    const progress = discoveryState.scrollOffset / discoveryState.maxScroll;
    cinematicState.timelineProgress = Math.min(1.0, Math.max(0.0, progress));

    // 3. Map progress to active Act index
    let activeActIdx = 0;
    const len = cinematicConfig.length;
    for (let i = 0; i < len; i++) {
      const cfg = cinematicConfig[i];
      if (cinematicState.timelineProgress >= cfg.start && (i === len - 1 ? cinematicState.timelineProgress <= cfg.end : cinematicState.timelineProgress < cfg.end)) {
        activeActIdx = i;
        break;
      }
    }

    // 4. Trigger Act changes
    if (activeActIdx !== cinematicState.currentActIndex) {
      const prevIdx = cinematicState.currentActIndex;
      cinematicState.currentActIndex = activeActIdx;
      cinematicState.currentActName = cinematicConfig[activeActIdx].name;

      // Force Discovery state to synchronize opacity thresholds automatically
      discoveryState.targetState = activeActIdx;
      discoveryState.transitionProgress = 0.0;

      EventBus.emit('CINEMATIC_ACT_CHANGED', {
        previous: prevIdx,
        current: activeActIdx,
        name: cinematicState.currentActName,
        time: time,
      });
    }
  }

  public dispose(): void {
    EventBus.off('NARRATIVE_TYPING_START', this.handleTypingStart);
    EventBus.off('NARRATIVE_TYPING_END', this.handleTypingEnd);
  }
}
