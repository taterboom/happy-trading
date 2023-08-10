import { Bot, Context } from "@happy-trading/core"
import { JSONStoragePlugin } from "@happy-trading/plugin-storage"
import { MonitorPlugin, monitor } from "../src/index"

describe("monitor plugin", () => {
  it("monitor function should be ok", () => {
    const db = {
      600030: [
        {
          code: "600030",
          time: "2021-08-31T10:02:00.000Z",
          close: 21.5,
          open: 21.5,
          high: 21.5,
          low: 21.5,
          volume: 0,
          amount: 0,
        },
        {
          code: "600030",
          time: "2021-08-31T10:03:00.000Z",
          close: 20.5,
          open: 20.5,
          high: 20.5,
          low: 20.5,
          volume: 0,
          amount: 0,
        },
      ],
    }

    expect(
      monitor(db, {
        1: -0.005,
        5: -0.008,
        30: -0.013,
      })
    ).not.toBeUndefined()
  })

  it.skip("should be ok", (done) => {
    const bot = new Bot({ codes: ["600030"], debug: true })
    class MockNotificationPlugin {
      install(context: Context) {
        // @ts-ignore
        context.on("notify", (e) => {
          done()
          bot.stop()
        })
      }
    }
    bot
      .use(new JSONStoragePlugin({ filepath: "./test.json" }))
      .use(new MockNotificationPlugin())
      .use(new MonitorPlugin())
    bot.start()
  })
})
