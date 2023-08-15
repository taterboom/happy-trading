import { PriceItem } from "@happy-trading/core"

// TODO 目前只有价格转折点，需要配合MACD才能确定正确的买卖点

const TURNNG_POINT = 1 // 转折需要根前x个KItem比较

/**
- 第一种买点：股价低于上一笔低点（背驰必要条件），高于前1（或者2、3…）点
- 第二种买点：股价高于上一笔低点（背驰笔的低点），高于前1（或者2、3…）点
- 第一种卖点：反第一种买点
- 第二种卖点：反第二种买点
 */
function sell3(kItems: PriceItem[], options: [number]) {
  if (kItems.length === 0) return false
  const [buyPoint] = options
  const price = kItems[kItems.length - 1].close
  return price <= buyPoint
}
function sell1(kItems: PriceItem[], options: [number] | [number, number]) {
  if (kItems.length === 0) return false
  const [lastBiHigh, turningPoint = TURNNG_POINT] = options
  const high = kItems[kItems.length - 1].high
  const prevIndex = Math.max(0, kItems.length - 1 - turningPoint)
  const prevKItems = kItems.slice(prevIndex, kItems.length - 1)
  return (
    high >= lastBiHigh &&
    prevKItems.length >= turningPoint &&
    prevKItems.every((item) => high <= item.high)
  )
}
function sell2(kItems: PriceItem[], options: [number] | [number, number]) {
  if (kItems.length === 0) return false
  const [lastBiHigh, turningPoint = TURNNG_POINT] = options
  const high = kItems[kItems.length - 1].high
  const prevIndex = Math.max(0, kItems.length - 1 - turningPoint)
  const prevKItems = kItems.slice(prevIndex, kItems.length - 1)
  return (
    high <= lastBiHigh &&
    prevKItems.length >= turningPoint &&
    prevKItems.every((item) => high <= item.high)
  )
}
function buy1(kItems: PriceItem[], options: [number] | [number, number]) {
  if (kItems.length === 0) return false
  const [lastBiLow, turningPoint = TURNNG_POINT] = options
  const low = kItems[kItems.length - 1].low
  const prevIndex = Math.max(0, kItems.length - 1 - turningPoint)
  const prevKItems = kItems.slice(prevIndex, kItems.length - 1)
  return (
    low <= lastBiLow &&
    prevKItems.length >= turningPoint &&
    prevKItems.every((item) => low >= item.low)
  )
}
function buy2(kItems: PriceItem[], options: [number] | [number, number]) {
  if (kItems.length === 0) return false
  const [lastBiLow, turningPoint = TURNNG_POINT] = options
  const low = kItems[kItems.length - 1].low
  const prevIndex = Math.max(0, kItems.length - 1 - turningPoint)
  const prevKItems = kItems.slice(prevIndex, kItems.length - 1)
  return (
    low >= lastBiLow &&
    prevKItems.length >= turningPoint &&
    prevKItems.every((item) => low >= item.low)
  )
}
export const Strategy = {
  sell3,
  sell1,
  sell2,
  buy1,
  buy2,
}
