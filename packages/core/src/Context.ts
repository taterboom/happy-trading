import { EventEmitter } from "eventemitter3"
import { DataService, PriceItem } from "./DataService"

export class Context<
  T extends EventEmitter.ValidEventTypes = {
    beforeTick: void
    afterTick: [PriceItem[]]
    beforeInit: void
    afterInit: void
    stop: void
  }
> extends EventEmitter<T> {
  codes: string[] = []
  dataService: DataService = new DataService()

  async emitAsync<K extends EventEmitter.EventNames<T>>(
    event: K,
    ...args: EventEmitter.EventArgs<T, K>
  ) {
    const listeners = this.listeners(event)
    if (listeners.length === 0) return false
    // @ts-ignore
    await Promise.all(listeners.map((fn) => fn(...args)))
    return true
  }
}
