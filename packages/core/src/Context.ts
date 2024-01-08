import { EventEmitter } from "eventemitter3"
import { DataService } from "./DataService"
// extend Context with log funciton
import "./plugins/Log"
import type { LogEventParams } from "./plugins/Log"
import { PriceItem } from "./types"
import { parseCode } from "./utils"

export type ContextError = {
  type: "fetch" | "beforeInit" | "initData"
  error: any
}

export class Context<
  T extends EventEmitter.ValidEventTypes = {
    beforeTick: void
    afterTick: [PriceItem[]]
    beforeInit: void
    afterInit: void
    initData: [PriceItem[]]
    stop: void
    error: ContextError
    log: LogEventParams
  }
> extends EventEmitter<T> {
  codes: string[] = [] // maybe {sh|sz}\d{6} or \d{6} or hk\w etc.
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

  get standardCodes() {
    return this.codes.map(parseCode)
  }
}
