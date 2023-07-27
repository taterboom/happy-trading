import dayjs from "dayjs"
import { Context } from "../Context"
import { Plugin } from "../Plugin"

declare module "../Context" {
  interface Context {
    log(title: string, body?: string): void
  }
}

export class Log implements Plugin {
  static log(title: string, body?: string) {
    console.log(`${dayjs().format("YYYY-MM-DD HH:mm")} [${title}] ${body || ""}`)
  }
  install(context: Context) {
    context.log = Log.log
    context.on("afterInit", () => {
      context.log("Init ok")
    })
    context.on("afterTick", () => {
      context.log("Tick")
    })
    context.on("stop", () => {
      context.log("Stop")
    })
  }
}
