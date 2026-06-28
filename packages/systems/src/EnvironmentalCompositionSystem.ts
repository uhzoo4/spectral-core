import { networkState } from '@cinematic-engine/core';

export class EnvironmentalCompositionSystem {
  public name = 'EnvironmentalCompositionSystem';

  /**
   * Structures a node's base coordinates according to its class index.
   * Classifications:
   * - 0 to 25%: Background pillars (infinite columns at the periphery)
   * - 25% to 35%: Foreground dust (hovering close)
   * - 35% to 100%: Midground cluster networks
   */
  public composeNode(index: number, total: number, basePos: { x: number; y: number; z: number }): void {
    const bgCutoff = Math.floor(total * 0.25);
    const fgCutoff = Math.floor(total * 0.35);

    if (index < bgCutoff) {
      // 1. Background Pillar: Infinite architectural column arrays
      const side = index % 2 === 0 ? -18.0 : 18.0;
      basePos.x = side + (Math.random() - 0.5) * 3.0;
      basePos.y = (Math.random() - 0.5) * 32.0; // Stretches vertically
      basePos.z = -18.0 + (Math.random() - 0.5) * 5.0; // Far depth
    } else if (index < fgCutoff) {
      // 2. Foreground Dust: Immediate hovering interactive nodes
      basePos.x = (Math.random() - 0.5) * 16.0;
      basePos.y = (Math.random() - 0.5) * 12.0;
      basePos.z = 6.0 + Math.random() * 4.0; // Near camera
    } else {
      // 3. Midground Network: Traditional network cluster nodes
      const clusterCounts = networkState.clusterCounts || 8;
      const clusterIdx = index % clusterCounts;
      const clusterBase = networkState.clusterBases[clusterIdx];

      if (clusterBase) {
        basePos.x = clusterBase.x + (Math.random() - 0.5) * 7.0;
        basePos.y = clusterBase.y + (Math.random() - 0.5) * 7.0;
        basePos.z = clusterBase.z + (Math.random() - 0.5) * 3.0; // Centered
      } else {
        basePos.x = (Math.random() - 0.5) * 10.0;
        basePos.y = (Math.random() - 0.5) * 10.0;
        basePos.z = (Math.random() - 0.5) * 4.0;
      }
    }
  }

  public update(_time: number, _delta: number): void {
    // Left empty: visual compositions are locked to base positions + systems drift
  }
}
