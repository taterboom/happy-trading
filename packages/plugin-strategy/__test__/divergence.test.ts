import { Bot } from "@happy-trading/core"
import { DingDingNotificationPlugin } from "@happy-trading/plugin-notification/dist/DingDingNotification"
import { MemoryStoragePlugin } from "../../plugin-storage/src/MemoryStoragePlugin"
import { DivergencePlugin } from "../src/divergence"
import { Strategy } from "../src/divergence/strategies"

describe("divergence", () => {
  it("DivergencePlugin", () => {
    new Bot({ codes: ["600030"], debug: true })
      .use(new MemoryStoragePlugin())
      .use(new DingDingNotificationPlugin({ webhook: "xxx" }))
      .use(new DivergencePlugin())
  })

  it("Strategy.sell1", () => {
    const items = [
      {
        code: "600030",
        time: "2021-01-01 09:31:00",
        open: 23.5,
        close: 23.5,
        high: 23.5,
        low: 23.5,
        volume: 0,
        amount: 0,
      },
      {
        code: "600030",
        time: "2021-01-01 09:32:00",
        open: 23.5,
        close: 23.4,
        high: 23.5,
        low: 23.4,
        volume: 0,
        amount: 0,
      },
    ]
    expect(Strategy.sell1(items, [23])).toBe(true)
    expect(Strategy.sell1(items, [23.5])).toBe(true)
    expect(Strategy.sell1(items, [23.6])).toBe(false)
  })

  it("Strategy.sell2", () => {
    const items = [
      {
        code: "600030",
        time: "2021-01-01 09:31:00",
        open: 23.5,
        close: 23.5,
        high: 23.5,
        low: 23.5,
        volume: 0,
        amount: 0,
      },
      {
        code: "600030",
        time: "2021-01-01 09:32:00",
        open: 23.5,
        close: 23.4,
        high: 23.5,
        low: 23.4,
        volume: 0,
        amount: 0,
      },
    ]
    expect(Strategy.sell2(items, [23.6])).toBe(true)
    expect(Strategy.sell2(items, [23.5])).toBe(true)
    expect(Strategy.sell2(items, [23.4])).toBe(false)
  })

  it("Strategy.sell3", () => {
    const items = [
      {
        code: "600030",
        time: "2021-01-01 09:31:00",
        open: 23.5,
        close: 23.5,
        high: 23.5,
        low: 23.5,
        volume: 0,
        amount: 0,
      },
    ]
    expect(Strategy.sell3(items, [23.6])).toBe(true)
    expect(Strategy.sell3(items, [23.5])).toBe(true)
    expect(Strategy.sell3(items, [23.4])).toBe(false)
  })

  it("Strategy.buy1", () => {
    const items = [
      {
        code: "600030",
        time: "2021-01-01 09:31:00",
        open: 23.5,
        close: 23.5,
        high: 23.5,
        low: 23.5,
        volume: 0,
        amount: 0,
      },
      {
        code: "600030",
        time: "2021-01-01 09:32:00",
        open: 23.5,
        close: 23.6,
        high: 23.6,
        low: 23.5,
        volume: 0,
        amount: 0,
      },
    ]
    expect(Strategy.buy1(items, [23.6])).toBe(true)
    expect(Strategy.buy1(items, [23.5])).toBe(true)
    expect(Strategy.buy1(items, [23.4])).toBe(false)
  })

  it("Strategy.buy2", () => {
    const items = [
      {
        code: "600030",
        time: "2021-01-01 09:31:00",
        open: 23.5,
        close: 23.5,
        high: 23.5,
        low: 23.5,
        volume: 0,
        amount: 0,
      },
      {
        code: "600030",
        time: "2021-01-01 09:32:00",
        open: 23.5,
        close: 23.6,
        high: 23.6,
        low: 23.5,
        volume: 0,
        amount: 0,
      },
    ]
    expect(Strategy.buy2(items, [23.4])).toBe(true)
    expect(Strategy.buy2(items, [23.5])).toBe(true)
    expect(Strategy.buy2(items, [23.6])).toBe(false)
  })
})
