import { PriceItem } from "@happy-trading/core"
import { simpleInsert, simpleInsertInDb } from "../src/utils"

describe("utils", () => {
  it("simpleInsert", () => {
    const arr: PriceItem[] = []
    const item1: PriceItem = {
      time: "2023-08-01 10:00:00",
      code: "000001",
      open: 1,
      high: 2,
      low: 0.5,
      close: 1.5,
      volume: 1,
      amount: 1,
    }
    simpleInsert(arr, item1)
    expect(arr).toEqual([item1])

    // append
    const item2: PriceItem = {
      time: "2023-08-01 10:01:00",
      code: "000001",
      open: 1,
      high: 2,
      low: 0.5,
      close: 1.5,
      volume: 1,
      amount: 1,
    }
    simpleInsert(arr, item2)
    expect(arr).toEqual([item1, item2])

    // append
    const item3: PriceItem = {
      time: "2023-08-01 10:04:00",
      code: "000001",
      open: 1,
      high: 2,
      low: 0.5,
      close: 1.5,
      volume: 1,
      amount: 1,
    }
    simpleInsert(arr, item3)
    expect(arr).toEqual([item1, item2, item3])

    // insert
    const item4: PriceItem = {
      time: "2023-08-01 10:03:00",
      code: "000001",
      open: 1,
      high: 2,
      low: 0.5,
      close: 1.5,
      volume: 1,
      amount: 1,
    }
    simpleInsert(arr, item4)
    expect(arr).toEqual([item1, item2, item4, item3])

    // replace
    const item5: PriceItem = {
      time: "2023-08-01 10:04:01",
      code: "000001",
      open: 1,
      high: 2,
      low: 0.5,
      close: 1.5,
      volume: 1,
      amount: 1,
    }
    simpleInsert(arr, item5)
    expect(arr).toEqual([item1, item2, item4, item5])
  })

  it("simpleInsertInDb", () => {
    const db = {}
    const maxSize = 2
    const item1: PriceItem = {
      time: "2023-08-01 10:00:00",
      code: "000001",
      open: 1,
      high: 2,
      low: 0.5,
      close: 1.5,
      volume: 1,
      amount: 1,
    }
    simpleInsertInDb(db, item1, maxSize)
    expect(db).toEqual({ "000001": [item1] })

    // append
    const item2: PriceItem = {
      time: "2023-08-01 10:01:00",
      code: "000001",
      open: 1,
      high: 2,
      low: 0.5,
      close: 1.5,
      volume: 1,
      amount: 1,
    }
    simpleInsertInDb(db, item2, maxSize)
    expect(db).toEqual({ "000001": [item1, item2] })

    // exceed max size
    const item3: PriceItem = {
      time: "2023-08-01 10:02:00",
      code: "000001",
      open: 1,
      high: 2,
      low: 0.5,
      close: 1.5,
      volume: 1,
      amount: 1,
    }
    simpleInsertInDb(db, item3, maxSize)
    expect(db).toEqual({ "000001": [item2, item3] })
  })
})
