import { Plugin } from "@happy-trading/core"
import { MAX_SIZE } from "./constants"
import { Database, StoragePluginContext } from "./types"
import { simpleInsertInDb } from "./utils"

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
        simpleInsertInDb(this.db, item, this.maxSize)
      })
    })
    context.getStorage = async () => {
      return this.db
    }
  }
}
