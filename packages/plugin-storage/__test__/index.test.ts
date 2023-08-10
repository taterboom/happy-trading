import { Bot } from "@happy-trading/core"
import { MemoryStoragePlugin } from "../src/MemoryStoragePlugin"
import { StoragePluginContext } from "../src/types"

describe("plugin-storage", () => {
  it("MemoryStoragePlugin should be ok", (done) => {
    const bot = new Bot({ codes: ["sh600030"], debug: true })
    const db = {
      sh600030: [
        {
          code: "sh600030",
          time: "2021-01-01 09:30:00",
          open: 23.5,
          close: 23.5,
          high: 23.5,
          low: 23.5,
          volume: 0,
          amount: 0,
        },
      ],
    }
    bot.use(new MemoryStoragePlugin({ db }))
    const context = bot.context as StoragePluginContext
    bot.context.on("afterTick", async (result) => {
      const storage = await context.getStorage()
      expect(storage).not.toBeNull()
      done()
      bot.stop()
    })
    bot.start()
  })
})
