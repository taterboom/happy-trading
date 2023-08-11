import { processStockData } from "../src/stock"
import db from "./mock.json"

describe("utils/stock", () => {
  it("processStockData should be ok", () => {
    const data = processStockData(db["600030"])
    expect(data).toEqual({
      "5": [
        {
          code: "600030",
          open: 23.6,
          high: 23.6,
          low: 23.4,
          close: 23.5,
          time: "2021-01-01 09:35:00",
          amount: 0,
          volume: 0,
        },
        {
          code: "600030",
          open: 23.5,
          high: 23.5,
          low: 23.5,
          close: 23.5,
          time: "2021-01-01 09:40:00",
          amount: 0,
          volume: 0,
        },
        {
          code: "600030",
          open: 23.5,
          high: 23.5,
          low: 23.5,
          close: 23.5,
          time: "2021-01-01 09:45:00",
          amount: 0,
          volume: 0,
        },
        {
          code: "600030",
          open: 23.5,
          high: 23.5,
          low: 23.5,
          close: 23.5,
          time: "2021-01-01 09:50:00",
          amount: 0,
          volume: 0,
        },
        {
          code: "600030",
          open: 23.5,
          high: 23.5,
          low: 23.5,
          close: 23.5,
          time: "2021-01-01 09:55:00",
          amount: 0,
          volume: 0,
        },
        {
          code: "600030",
          open: 23.5,
          high: 24,
          low: 23.5,
          close: 24,
          time: "2021-01-01 10:00:00",
          amount: 0,
          volume: 0,
        },
      ],
      "30": [
        {
          code: "600030",
          open: 23.6,
          high: 24,
          low: 23.4,
          close: 24,
          time: "2021-01-01 10:00:00",
          amount: 0,
          volume: 0,
        },
      ],
    })
  })
})
