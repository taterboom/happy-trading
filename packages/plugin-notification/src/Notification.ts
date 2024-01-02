import { Context, Plugin } from "@happy-trading/core"
import { NotificationLevel, NotificationOptions } from "./types"

export type NotificationContext = Context<{ notify: NotificationOptions }>

export abstract class Notification<C = any, T extends NotificationContext = NotificationContext>
  implements Plugin
{
  config: C
  levels: NotificationLevel[] = []

  abstract notify(options: NotificationOptions): Promise<any>

  constructor(config: C, levels?: NotificationLevel[]) {
    this.config = config
    if (levels) this.levels = levels
  }

  install(context: T & Context) {
    context.on("notify", (options: NotificationOptions) => {
      this.onNotify(context, options)
    })
    context.on("error", (e) => {
      this.onError(context, e)
    })
  }

  async onNotify(context: Context, options: NotificationOptions) {
    if (options.level && this.levels.length > 0 && !this.levels.includes(options.level)) {
      return
    }
    context.log(
      `${Object.getPrototypeOf(this)?.constructor?.name}`,
      JSON.stringify({ title: options.title, body: options.body })
    )
    try {
      await this.notify(options)
    } catch (err: any) {
      context.emit("error", {
        type: `${Object.getPrototypeOf(this).name} fetch`,
        message: err?.message || "error",
      })
    }
  }

  async onError(context: Context, e: any) {
    this.onNotify(context, {
      level: "alert",
      title: "Happy-Trading Error",
      body: JSON.stringify(e, null, 2),
    })
  }
}
