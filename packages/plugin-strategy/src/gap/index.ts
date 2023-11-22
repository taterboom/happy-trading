import type { Context, Plugin, PriceItem } from "@happy-trading/core"
import type { NotificationContext, NotificationOptions } from "@happy-trading/plugin-notification"
import type { Database, StoragePluginContext } from "@happy-trading/plugin-storage"
import { processStockData } from "@happy-trading/utils"

/**
 * 监控5分钟缺口
 */

export class Gap implements Plugin {
  threshold = 1.1
  constructor(threshold?: number) {
    if (threshold) {
      this.threshold = threshold
    }
  }
  install(context: Context & StoragePluginContext & NotificationContext & Context) {
    context.on("afterTick", async () => {
      try {
        const db = await context.getStorage()
        execute({
          db,
          codes: context.standardCodes,
          threshold: this.threshold,
          onOk: (result) => {
            context.emit("notify", { ...result })
          },
        })
      } catch (err: any) {
        context.log("Gap Error", err?.message || "error")
        throw err
      }
    })
  }
}

type EnhancedDatabase = {
  [code: string]: {
    1: Database[string]
    5: Database[string]
    30: Database[string]
  }
}
/**
 * down: 低开
 * up: 高开
 */
type State = "down" | "up"

const generatePercentPoint = (newEl: number, oldEl: number) => {
  return Math.abs((newEl - oldEl) / oldEl) * 100
}

// one tick per minute
export function execute(options: {
  db: Database
  codes: string[]
  threshold: number
  onOk?: (result: ReturnType<typeof notifyInfo>) => void
}) {
  const { db: _db, codes, threshold, onOk } = options
  const db = Object.entries(_db).reduce((acc, [code, items]) => {
    acc[code] = {
      1: items,
      ...processStockData(items),
    }
    return acc
  }, {} as EnhancedDatabase)
  codes.forEach((code) => {
    const last1 = db[code][5].at(-1)
    const last2 = db[code][5].at(-2)
    if (last1 && last2) {
      if (last1.open > last2.high) {
        // 高开
        const diff = generatePercentPoint(last1.open, last2.high)
        if (diff >= threshold) {
          onOk?.(
            notifyInfo({
              code,
              level: 5,
              dir: "up",
              diff,
              kItems: db[code][5],
            })
          )
        }
      }
      if (last1.open < last2.low) {
        // 低开
        const diff = generatePercentPoint(last1.open, last2.low)
        if (diff >= threshold) {
          onOk?.(
            notifyInfo({
              code,
              level: 5,
              dir: "down",
              diff,
              kItems: db[code][5],
            })
          )
        }
      }
    }
  })
}

function notifyInfo(options: {
  code: string
  level: number
  dir: State
  diff: number
  kItems: PriceItem[]
}): NotificationOptions {
  let title = `🟡 ${options.code} ${options.level}分钟 ${
    options.dir === "up"
      ? `高开${options.diff.toFixed(1)}% 注意卖出`
      : `低开${options.diff.toFixed(1)}%`
  }`
  const body = `当前价格: ${options.kItems[options.kItems.length - 1]?.close}`
  return {
    title,
    body,
    raw: options,
    level: "alert",
  }
}
