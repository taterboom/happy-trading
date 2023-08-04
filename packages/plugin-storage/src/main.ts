import { Context, Plugin, PriceItem } from "@happy-trading/core"

// save data when "afterTick", should check time.

type Database = {
  [code: string]: PriceItem[]
}

const db: Database = {
  sh600030: [
    {
      code: "sh600030",
      time: "2020-01-01 09:30:00",
      open: 10,
      high: 11,
      low: 9,
      close: 10.5,
      volume: 1000,
      amount: 123,
    },
  ],
}

class StoragePlugin implements Plugin {
  install(context: Context) {
    context.on("beforeInit", () => {
      // TODO fetch all data when "beforeInit", save the data in memory.
    })
    context.on("afterTick", (result) => {
      //
      result.forEach((item) => {
        const { code } = item
        const stockData = db[code] || []
        // TODO check time
        // find the position where item.time > prev time and item.time < next time, and insert there
      })
    })
  }
}
