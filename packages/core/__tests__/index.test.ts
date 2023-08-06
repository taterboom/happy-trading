import { Bot } from "../src/Bot"

describe("Bot", () => {
  it("test", (done) => {
    const db = {
      xxx: [], // dataframe
    }
    const bot = new Bot({ codes: ["sh600030"] })
    bot.start()
    bot.context.on("afterTick", (result) => {
      console.log("st", result)
      done()
      // TODO plugin: DB, Strategy, Monitor, Notification, API Proxy
      // save db
      result.forEach((row) => {
        // check time
        db[row.code].push(row)
      })
      bot.context.codes.forEach((code) => {
        const rows = db[code]
        // strategy
        // monitor
      })
    })

    expect(bot).not.toBeNull()
  })
})
