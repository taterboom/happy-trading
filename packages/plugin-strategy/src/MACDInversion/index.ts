import type { Context, Plugin, PriceItem } from "@happy-trading/core"
import type { NotificationContext, NotificationOptions } from "@happy-trading/plugin-notification"
import type { Database, StoragePluginContext } from "@happy-trading/plugin-storage"
import { getName, processStockData } from "@happy-trading/utils"
import dayjs from "dayjs"
import { createTA } from "../utils"

export class MACDInversion implements Plugin {
  install(context: Context & StoragePluginContext & NotificationContext & Context) {
    context.on("afterTick", async () => {
      try {
        const db = await context.getStorage()
        execute({
          db,
          codes: context.standardCodes,
          onOk: (result) => {
            context.emit("notify", { ...result, from: "MACDInversionPlugin" })
          },
        })
      } catch (err: any) {
        context.log("MACDInversion Error", {
          message: err?.message || "error",
          from: "MACDInversionPlugin",
        })
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
 * last 3 MACD
 * down |   crossup | |   up |   crossdown
 *       |           |      |             |
 *        |                |             | |
 */
type State = "down" | "crossup" | "up" | "crossdown"

// one tick per minute
export function execute(options: {
  db: Database
  codes: string[]
  onOk?: (result: ReturnType<typeof notifyInfo>) => void
}) {
  const { db: _db, codes, onOk } = options
  const db = Object.entries(_db).reduce((acc, [code, items]) => {
    acc[code] = {
      1: items,
      ...processStockData(items),
    }
    return acc
  }, {} as EnhancedDatabase)
  const minute = dayjs().minute()
  ;([/*5, */ 30] as const).forEach((level) => {
    if (minute % level === 0) {
      // 循环codes 判断当前level的MACD是否反转
      codes.forEach((code) => {
        let state: State | null = null
        const ta = createTA(db[code][level])
        // line = DIF
        // signal = DEA
        // histogram*2 = MACD
        const macd = ta.macd()

        // 金叉
        if (macd.hist.at(-1) > 0 && macd.hist.at(-2) < 0) {
          state = "up"
        }
        // 死叉
        if (macd.hist.at(-1) < 0 && macd.hist.at(-2) > 0) {
          state = "down"
        }
        // MACD反转向上
        if (macd.hist.at(-3) > macd.hist.at(-2) && macd.hist.at(-2) < macd.hist.at(-1)) {
          state = "crossup"
        }
        // MACD反转向下
        if (macd.hist.at(-3) < macd.hist.at(-2) && macd.hist.at(-2) > macd.hist.at(-1)) {
          state = "crossdown"
        }

        if (state === "crossdown" || state === "crossup") {
          const kItems = db[code][level].slice(-3)
          onOk?.(notifyInfo({ code, level, dir: state, kItems }))
        } else if (state === "up" || state === "down") {
          const kItems = db[code][level].slice(-3)
          onOk?.(notifyInfo({ code, level, dir: state, kItems }))
        }
      })
    }
  })
}

function notifyInfo(options: {
  code: string
  level: number
  dir: State
  kItems: PriceItem[]
}): NotificationOptions {
  let title = ""
  if (options.dir === "crossup" || options.dir === "crossdown") {
    const flag = options.dir === "crossup" ? "🟢" : "🔴"
    title = `${flag} ${options.code} ${getName(options.code)} ${options.level}分钟 MACD 反转`
  }
  if (options.dir === "up" || options.dir === "down") {
    const flag = options.dir === "up" ? "金叉" : "死叉"
    title = `🟡 ${options.code} ${getName(options.code)} ${options.level}分钟 MACD ${flag}`
  }
  const body = `当前价格: ${options.kItems[options.kItems.length - 1]?.close}`
  return {
    title,
    body,
    raw: options,
    level: /*options.level === 30 ? "alert" : */ "warn",
  }
}
