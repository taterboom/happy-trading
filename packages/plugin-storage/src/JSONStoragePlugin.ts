import { Context, Plugin } from "@happy-trading/core"
import fs from "node:fs/promises"
import path from "node:path"
import { Database } from "./types"

declare module "@happy-trading/core" {
  interface Context {
    getStorage(): Database
  }
}

export class JSONStoragePlugin implements Plugin {
  filepath?: string
  db: Database = {}
  constructor(options: { filepath?: string }) {
    this.filepath = options.filepath
  }
  install(context: Context) {
    context.on("beforeInit", () => this.initDbFromFile())
    context.on("afterTick", (result) => {
      result.forEach((item) => {
        const { code } = item
        if (!this.db[code]) {
          this.db[code] = [item]
        } else {
          this.db[code].push(item)
        }
        // TODO check time
        // find the position where item.time > prev time and item.time < next time, and insert there
      })
      this.saveDbToFile()
    })
    context.getStorage = () => {
      return this.db
    }
  }
  initDbFromFile() {
    if (this.filepath) {
      return fs
        .readFile(this.filepath, "utf-8")
        .then((data) => {
          try {
            const localData = JSON.parse(data)
            this.db = localData
          } catch (e) {
            console.error(e)
          }
        })
        .catch(() => {
          console.log("no file found")
        })
    }
  }
  async saveDbToFile() {
    if (this.filepath) {
      // write file or create it if not exists
      try {
        await fs.access(this.filepath)
      } catch (e) {
        const dirname = path.dirname(this.filepath)
        await fs.mkdir(dirname, { recursive: true })
      }
      await fs.writeFile(this.filepath, JSON.stringify(this.db))
    }
  }
}
