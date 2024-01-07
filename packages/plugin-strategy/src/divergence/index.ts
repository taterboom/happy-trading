import type { Context, Plugin, PriceItem } from "@happy-trading/core"
import type { NotificationContext, NotificationOptions } from "@happy-trading/plugin-notification"
import type { Database, StoragePluginContext } from "@happy-trading/plugin-storage"
import { getName, parseCode, processStockData } from "@happy-trading/utils"
import dayjs from "dayjs"
import { Strategy } from "./strategies"

export type DivergencePluginContext = {
  DivergencePluginStrategies?: StrategyConfig[]
}

export class DivergencePlugin implements Plugin {
  strategies: StrategyConfig[] = []
  constructor(options?: { strategies?: StrategyConfig[] }) {
    if (options?.strategies) {
      this.strategies = options.strategies
    }
  }
  install(context: DivergencePluginContext & StoragePluginContext & NotificationContext & Context) {
    context.on("afterTick", async () => {
      if (context.DivergencePluginStrategies) {
        this.strategies = context.DivergencePluginStrategies
      }
      try {
        const db = await context.getStorage()
        executeStrategies({
          db,
          strategies: this.strategies,
          onOk: (result) => {
            context.emit("notify", { ...result, level: "alert" })
          },
        })
      } catch (err: any) {
        context.log("DivergencePlugin Error", err?.message || "error")
        throw err
      }
    })
  }
}

export type StrategyConfig = {
  level: 1 | 5 | 30
  code: string
  strategy: keyof typeof Strategy
  options: any
  extra: any
}

const LEVELS = [1, 5, 30] as const

type EnhancedDatabase = {
  [code: string]: {
    1: Database[string]
    5: Database[string]
    30: Database[string]
  }
}

// one tick per minute
export function executeStrategies(options: {
  db: Database
  strategies: StrategyConfig[]
  onOk?: (result: ReturnType<typeof notifyInfo>) => void
}) {
  const { db: _db, strategies, onOk } = options
  const db = Object.entries(_db).reduce((acc, [code, items]) => {
    acc[code] = {
      1: items,
      ...processStockData(items),
    }
    return acc
  }, {} as EnhancedDatabase)
  const minute = dayjs().minute()
  LEVELS.forEach((level) => {
    if (minute % level === 0) {
      const currentLevelStrategies = strategies.filter((item) => item.level === level)
      currentLevelStrategies.forEach((item) => {
        const { code, strategy, options } = item
        const kItems = db[code][level]
        if (strategy in Strategy) {
          const ok = Strategy[strategy](kItems, options)
          if (ok) {
            onOk?.(notifyInfo(item, kItems))
          }
        }
      })
    }
  })
}

function notifyInfo(strategy: StrategyConfig, kItems: PriceItem[]): NotificationOptions {
  const flag = strategy.strategy.startsWith("sell") ? "🟢" : "🔴"
  const title = `${flag} ${strategy.code} ${getName(parseCode(strategy.code))} ${
    strategy.strategy
  } 指标已达到!`
  const body = `当前价格: ${kItems[kItems.length - 1].close} 
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
