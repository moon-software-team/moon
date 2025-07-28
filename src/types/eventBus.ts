// type for the event bus callback
type BusCallback<T = unknown> = (data?: T) => void;

// Type of the event bus handlers
type BusHandler<EventList> = {
  event: keyof EventList;
  callback: BusCallback<EventList[keyof EventList]>;
  once: boolean;
};

// Simple event bus class to add events on a class
export class EventBus<EventList extends Record<string, unknown>> {
  // The list of handlers in the class
  private handlers: BusHandler<EventList>[] = [];

  /**
   * Add a listener for a specific event
   * @param event The event to wait for
   * @param callback The callback when the event is emitted
   */
  public on<T extends keyof EventList>(event: T, callback: BusCallback<EventList[T]>): void {
    this.handlers.push({ event, callback, once: false });
  }

  /**
   * Add a listener for a specific event once
   * @param event The event to wait for
   * @param callback The callback when the event is emitted
   */
  public once<T extends keyof EventList>(event: T, callback: BusCallback<EventList[T]>): void {
    this.handlers.push({ event, callback, once: true });
  }

  /**
   * Private function to emit an event in the class
   * @param event The event to emit
   * @param data The data to send in the emittion
   */
  protected emit<T extends keyof EventList>(event: T, data?: EventList[T]): void {
    this.handlers.filter((handler) => handler.event === event).forEach((handler) => handler.callback(data));
    this.handlers = this.handlers.filter((handler) => handler.event !== event || !handler.once);
  }

  public off<T extends keyof EventList>(event: T, callback?: BusCallback<EventList[T]>): void {
    if (callback) {
      // Remove handlers matching both the event and the callback
      this.handlers = this.handlers.filter((handler) => !(handler.event === event && handler.callback === callback));
    } else {
      // Remove all handlers for the specified event
      this.handlers = this.handlers.filter((handler) => handler.event !== event);
    }
  }
}
