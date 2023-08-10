import { Plugin } from "@happy-trading/core"
import { MAX_SIZE } from "./constants"
import { Database, StoragePluginContext } from "./types"

export class MemoryStoragePlugin implements Plugin {
  db: Database = {}
  maxSize: number
  constructor(options?: { db?: Database; maxSize?: number }) {
    this.db = options?.db || {}
    this.maxSize = options?.maxSize || MAX_SIZE
  }
  install(context: StoragePluginContext) {
    context.on("afterTick", (result) => {
      result.forEach((item) => {
        const { code } = item
        if (!this.db[code]) {
          this.db[code] = [item]
        } else {
          if (this.db[code].length > this.maxSize) {
            this.db[code].shift()
          }
          this.db[code].push(item)
        }
        // TODO 假设 stockData 没有重复，且是按照时间顺序排列的
        // TODO check time
        // find the position where item.time > prev time and item.time < next time, and insert there
      })
    })
    context.getStorage = async () => {
      return this.db
    }
  }
}
