import { PriceItem } from "@happy-trading/core"
import TA from "ta-math"

export function createTA(priceItems: PriceItem[]) {
  return new TA(
    priceItems.map((item) =>
      [item.time, item.open, item.high, item.low, item.close, item.volume].map(Number)
    ),
    // @ts-ignore
    undefined
  )
}
