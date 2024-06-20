export type StringKeyOf<T> = Extract<keyof T, string>
export type CallbackType<
  T extends Record<string, any>,
  EventName extends StringKeyOf<T>,
> = T[EventName] extends any[] ? T[EventName] : [T[EventName]]
export type CallbackFunction<
  T extends Record<string, any>,
  EventName extends StringKeyOf<T>,
> = (...props: CallbackType<T, EventName>) => any

export class EventEmitter<T extends Record<string, any>> {

  private callbacks: { [key: string]: Function[] } = {}

  public on<EventName extends StringKeyOf<T>>(event: EventName, fn: CallbackFunction<T, EventName>): this {
    if (!this.callbacks[event]) {
      this.callbacks[event] = []
    }

    this.callbacks[event].push(fn)

    return this
  }

  public emit<EventName extends StringKeyOf<T>>(event: EventName, ...args: CallbackType<T, EventName>): this {
    const callbacks = this.callbacks[event]

    if (callbacks) {
      for (let i = 0; i < callbacks.length; i++) {
        if (callbacks[i].apply(this, args)) {
          //返回true，停止向下执行
          break;
        }
      }
      // callbacks.forEach(callback => callback.apply(this, args))
    }

    return this
  }

  public off<EventName extends StringKeyOf<T>>(event: EventName, fn?: CallbackFunction<T, EventName>): this {
    const callbacks = this.callbacks[event]

    if (callbacks) {
      if (fn) {
        this.callbacks[event] = callbacks.filter(callback => callback !== fn)
      } else {
        delete this.callbacks[event]
      }
    }

    return this
  }

  public removeAllListeners(): void {
    this.callbacks = {}
  }
}
