import dayjs from "dayjs"
import { LogItem } from "service/utils/types"
import { Database, KItem } from "../data/data"
import { Strategy } from "./Strategy"
import { StrategyConfig } from "./fetchStrategiesFromNotion"

const LEVELS = ["1", "5", "30"] as const
// one tick per minute
export function execute(options: {
  time: number
  db: Database
  strategies: StrategyConfig[]
  onOk?: (result: ReturnType<typeof notifyInfo>) => void
}) {
  const { time, db, strategies, onOk } = options
  LEVELS.forEach((level) => {
    if (time % +level === 0) {
      const currentLevelStrategies = strategies.filter((item) => item.level === level)
      currentLevelStrategies.forEach((item) => {
        const { code, strategy, options } = item
        const kItems = db[code][level]
        const ok = Strategy[strategy](kItems, options)
        if (ok) {
          onOk?.(notifyInfo(item, kItems))
        }
      })
    }
  })
}

// TODO clear
const emailFlag = new Set()

function notifyInfo(strategy: StrategyConfig, kItems: KItem[]): LogItem | undefined {
  const id = `${dayjs().date()}-${strategy.code}-${strategy.strategy}-${
    strategy.level
  }-${strategy.options.join(",")}`
  if (emailFlag.has(id)) {
    return
  }
  emailFlag.add(id)

  const flag = strategy.strategy.startsWith("sell") ? "🟢" : "🔴"

  const title = `${flag} ${strategy.code} ${strategy.strategy} 指标已达到!`
  const body = `当前价格: ${kItems[kItems.length - 1][0]} 
options: ${strategy.options} 
level: ${strategy.level} 
extra: ${strategy.extra || ""}`
  return {
    title,
    body,
    raw: {
      strategy,
      kItems,
    },
  }
}
