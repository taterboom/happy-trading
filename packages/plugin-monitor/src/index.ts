import { Context, Plugin, PriceItem } from "@happy-trading/core"
import {
  NotificationContext,
  NotificationOptions,
} from "@happy-trading/plugin-notification/dist/types"
import { Database, StoragePluginContext } from "@happy-trading/plugin-storage"
import { processStockData } from "@happy-trading/utils"
import dayjs from "dayjs"

type EnhancedDatabase = {
  [code: string]: {
    1: Database[string]
    5: Database[string]
    30: Database[string]
  }
}

/**
 * @default { 1: -0.005, 5: -0.008, 30: -0.013 }
 */
type MonitorConfig = {
  1?: number
  5?: number
  30?: number
}

export class MonitorPlugin implements Plugin {
  // 异常下跌配置
  config: MonitorConfig
  constructor(
    config: MonitorConfig = {
      1: -0.005,
      5: -0.008,
      30: -0.013,
    }
  ) {
    this.config = config
  }
  install(context: StoragePluginContext & NotificationContext & Context): void {
    context.on("afterTick", async (result) => {
      const db = await context.getStorage()
      const notification = monitor(db, this.config)
      if (notification) {
        return context.emit("notify", notification)
      }
    })
  }
}

function calDelta(kItems: PriceItem[]) {
  if (kItems.length === 0) return 0
  const preItem = kItems[kItems.length - 2]
  const currentItem = kItems[kItems.length - 1]
  if (!preItem || !currentItem) {
    return 0
  }
  return (currentItem.low - preItem.high) / preItem.high
}

function percent(num: number) {
  return `${(num * 100).toFixed(2)}%`
}

type Warning = [1 | 5 | 30, number, PriceItem[]] // [分钟, 跌幅, 数据]

// 异常下跌
function getWarinings(data: EnhancedDatabase[string], config: MonitorConfig) {
  const warnings: Warning[] = []

  if (data[1].length === 0) {
    return warnings
  }

  const currentMinute = dayjs(data[1].at(-1)!.time).minute()

  Object.entries(config).forEach(([minute, threshold]) => {
    const numMinute = minute as unknown as keyof typeof data
    if (currentMinute % numMinute !== 0) return
    const minuteChange = calDelta(data[numMinute])
    if (minuteChange < threshold) {
      warnings.push([numMinute, minuteChange, data[numMinute]])
    }
  })

  return warnings
}

export function monitor(data: Database, config: MonitorConfig): NotificationOptions | undefined {
  const db = Object.entries(data).reduce((acc, [code, items]) => {
    acc[code] = {
      1: items,
      ...processStockData(items),
    }
    return acc
  }, {} as EnhancedDatabase)

  const warningInfo: [string, number, Warning[]][] = Object.entries(db)
    .map(([code, info]) => {
      const warnings = getWarinings(info, config)
      if (warnings.length === 0) {
        return undefined as never
      }
      return [code, info[1].at(-1)?.close, warnings] as [string, number, Warning[]]
    })
    .filter(Boolean)

  if (warningInfo.length === 0) return

  const title = `${dayjs().format("YYYY-MM-DD HH:mm")} 🟡 ${warningInfo
    .map((item) => item[0])
    .join("、")} 异常下跌`
  const body = warningInfo
    .map(
      (item) =>
        `|- ${item[0]} ${item[1]} ${item[2]
          .map((warning: Warning) => `${warning[0]}分钟跌幅${percent(warning[1])}`)
          .join(", ")}`
    )
    .join("\n ")

  return {
    title,
    body,
    raw: warningInfo,
  }
}
