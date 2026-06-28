import { EventBus } from './EventBus';

export interface System {
  name: string;
  update(time: number, delta: number): void;
  dispose?(): void;
}

export class Engine {
  private systems: System[] = [];
  private static instance: Engine | null = null;

  public static getInstance(): Engine {
    if (!this.instance) {
      this.instance = new Engine();
    }
    return this.instance;
  }

  public registerSystem(system: System): void {
    // Prevent duplicate registrations and listeners loop bugs
    const existingIdx = this.systems.findIndex((s) => s.name === system.name);
    if (existingIdx !== -1) {
      const old = this.systems[existingIdx];
      if (old.dispose) {
        old.dispose();
      }
      this.systems[existingIdx] = system;
    } else {
      this.systems.push(system);
    }
  }

  public unregisterSystem(name: string): void {
    const idx = this.systems.findIndex((s) => s.name === name);
    if (idx !== -1) {
      const old = this.systems[idx];
      if (old.dispose) {
        old.dispose();
      }
      this.systems.splice(idx, 1);
    }
  }

  public update(time: number, delta: number): void {
    const len = this.systems.length;
    for (let i = 0; i < len; i++) {
      this.systems[i].update(time, delta);
    }
  }

  public dispose(): void {
    const len = this.systems.length;
    for (let i = 0; i < len; i++) {
      if (this.systems[i].dispose) {
        this.systems[i].dispose!();
      }
    }
    this.systems = [];
  }
}

export const engine = Engine.getInstance();
