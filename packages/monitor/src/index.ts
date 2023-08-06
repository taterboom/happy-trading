import { Context, Plugin } from "@happy-trading/core"
import { Database } from "@happy-trading/plugin-storage"
import dayjs from "dayjs"

// import { LogItem } from "./types"

// class MonitorPlugin implements Plugin {
//   install(context: Context): void {
//     context.on("afterTick", (result) => {
//       const db = context.getStorage()
//     })
//   }
// }

// function calDelta(kItems: KItem[]) {
//   if (kItems.length === 0) return 0
//   const preItem = kItems[kItems.length - 2]
//   const currentItem = kItems[kItems.length - 1]
//   if (!preItem || !currentItem) {
//     return 0
//   }

//   return (currentItem[2] - preItem[1]) / preItem[1]
// }

// function percent(num: number) {
//   return `${(num * 100).toFixed(2)}%`
// }

// type Warning = [1 | 5 | 30, number, KItem[]] // [分钟, 跌幅, 数据]

// // 异常下跌：
// // 1分钟内下降超过0.5%
// // 5分钟内跌幅超过0.8%
// // 30分钟跌幅超过1.3%
// function getWarinings(time: number, data: Database[string]) {
//   const warnings: Warning[] = []

//   const minute1Change = calDelta(data[1])
//   if (minute1Change < -0.005) {
//     warnings.push([1, minute1Change, data[1]])
//   }

//   if (time % 5 === 0) {
//     const minute5Change = calDelta(data[5])
//     if (minute5Change < -0.008) {
//       warnings.push([5, minute5Change, data[5]])
//     }
//   }

//   if (time % 30 === 0) {
//     const minute30Change = calDelta(data[30])
//     if (minute30Change < -0.013) {
//       warnings.push([30, minute30Change, data[30]])
//     }
//   }
//   return warnings
// }

// // TODO
// // function getUpsAndDowns(data: Database[string], level: 1|5|30, size = 5) {
// //   const kItems = data[level]
// //   const last
// // }

// // time: minute
// export function monitor(time: number, data: Database): LogItem | undefined {
//   // 返回 当前价格，warning info， 五分钟涨跌
//   const warningInfo: [string, number, Warning[]][] = Object.entries(data)
//     .map(([code, info]) => {
//       const warnings = getWarinings(time, info)
//       if (warnings.length === 0) {
//         return undefined as never
//       }
//       return [code, info[1].at(-1)?.[0], warnings] as [string, number, Warning[]]
//     })
//     .filter(Boolean)

//   if (warningInfo.length === 0) return

//   const title = `${dayjs().format("YYYY-MM-DD HH:mm")} 🟡 ${warningInfo
//     .map((item) => item[0])
//     .join("、")} 异常下跌`
//   const body = warningInfo
//     .map(
//       (item) =>
//         `|- ${item[0]} ${item[1]} ${item[2]
//           .map((warning: Warning) => `${warning[0]}分钟跌幅${percent(warning[1])}`)
//           .join(", ")}`
//     )
//     .join("\n ")

//   console.log(title, "\n", body)
//   return {
//     title,
//     body,
//     raw: warningInfo,
//   }
// }
