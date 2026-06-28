type Listener = (data?: any) => void;

export class EventBus {
  private static listeners: Record<string, Listener[]> = {};

  public static on(event: string, callback: Listener): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  public static off(event: string, callback: Listener): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
  }

  public static emit(event: string, data?: any): void {
    const list = this.listeners[event];
    if (!list) return;
    const len = list.length;
    for (let i = 0; i < len; i++) {
      list[i](data);
    }
  }
}
