import { DepthHierarchySystem } from './DepthHierarchySystem';
import { FocusHierarchySystem } from './FocusHierarchySystem';
import { EnvironmentalCompositionSystem } from './EnvironmentalCompositionSystem';
import { AtmosphereDirector } from './AtmosphereDirector';
import { SpatialDirector } from './SpatialDirector';

export class PresenceSystem {
  public name = 'PresenceSystem';

  private depthSystem: DepthHierarchySystem;
  private focusSystem: FocusHierarchySystem;
  private compositionSystem: EnvironmentalCompositionSystem;
  private atmosphereDirector: AtmosphereDirector;
  private spatialDirector: SpatialDirector;

  constructor() {
    this.depthSystem = new DepthHierarchySystem();
    this.focusSystem = new FocusHierarchySystem();
    this.compositionSystem = new EnvironmentalCompositionSystem();
    this.atmosphereDirector = new AtmosphereDirector();
    this.spatialDirector = new SpatialDirector();
  }

  public update(time: number, delta: number): void {
    // Orchestrate update ticks of all spatial subsystems
    this.depthSystem.update(time, delta);
    this.focusSystem.update(time, delta);
    this.compositionSystem.update(time, delta);
    this.atmosphereDirector.update(time, delta);
    this.spatialDirector.update(time, delta);
  }
}
