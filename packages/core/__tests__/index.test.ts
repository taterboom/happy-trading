import { Bot } from "../src/Bot"

describe("Bot", () => {
  it("test", (done) => {
    const bot = new Bot({ codes: ["sh600030"], debug: true })
    bot.start()
    bot.context.on("afterTick", (result) => {
      expect(result.length).toBe(1)
      done()
      bot.stop()
    })
  })
})
