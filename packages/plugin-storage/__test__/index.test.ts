import { Bot } from "@happy-trading/core"
import { JSONStoragePlugin } from "../src/JSONStoragePlugin"

describe("plugin-storage", () => {
  it("test", (done) => {
    const bot = new Bot({ codes: ["sh600030"], debug: true })
    bot.use(new JSONStoragePlugin({ filepath: "./test.json" }))
    bot.context.on("afterTick", (result) => {
      console.log("afterTick", result, bot.context.getStorage())
      done()
    })
    bot.start()
  })
})
