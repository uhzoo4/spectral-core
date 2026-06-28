export class TimeSystem {
  public name = 'TimeSystem';
  public elapsed = 0;

  public update(time: number, delta: number): void {
    this.elapsed = time;
  }
}
