import dayjs from "dayjs"
import tz from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { Context } from "../Context"
import { Plugin } from "../Plugin"

dayjs.extend(utc)
dayjs.extend(tz)

declare module "../Context" {
  interface Context {
    log(title: string, body?: any): void
  }
}

export type LogEventParams = { title: string; body?: any; from?: string }

export class Log implements Plugin {
  static log(title: string, body?: any) {
    console.log(
      `${dayjs.utc().tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm")} [${title}] ${JSON.stringify(
        body
      )}`
    )
  }
  install(context: Context) {
    context.log = (title, body) => {
      Log.log(title, body)
      context.emit("log", {
        title,
        body,
        from: body?.from,
      })
    }
    context.on("afterInit", () => {
      context.log("Init ok")
    })
    context.on("afterTick", (e) => {
      context.log("Tick", e.map((e) => e.code).join(", "))
    })
    context.on("stop", () => {
      context.log("Stop")
    })
    context.on("error", (e) => {
      context.log("Error", e.type + (e?.message ?? ""))
    })
  }
}
