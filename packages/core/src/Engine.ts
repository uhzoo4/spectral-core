import { MatrixPool, VectorPool } from '@cinematic-engine/memory';

export interface ISystem {
  name: string;
  update(time: number, delta: number): void;
  dispose?(): void;
}

export class Engine {
  private systems: ISystem[] = [];
  private static instance: Engine | null = null;
  
  public matrixPool: MatrixPool;
  public vectorPool: VectorPool;

  constructor() {
    this.matrixPool = new MatrixPool(128);
    this.vectorPool = new VectorPool(256);
  }

  public static getInstance(): Engine {
    if (!this.instance) {
      this.instance = new Engine();
    }
    return this.instance;
  }

  public registerSystem(system: ISystem): void {
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
    
    // Automatically recycle scratch vectors/matrices at the end of the frame tick
    this.matrixPool.releaseAll();
    this.vectorPool.releaseAll();
  }

  public dispose(): void {
    const len = this.systems.length;
    for (let i = 0; i < len; i++) {
      if (this.systems[i].dispose) {
        this.systems[i].dispose!();
      }
    }
    this.systems = [];
    this.matrixPool.releaseAll();
    this.vectorPool.releaseAll();
  }
}

export const engine = Engine.getInstance();
