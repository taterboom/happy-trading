import { Context, Plugin } from "@happy-trading/core"
import { NotificationContext, NotificationOptions } from "./types"

interface DingDingNotificationPluginContextPart extends NotificationContext {
  notifyViaDingDing(options: NotificationOptions): Promise<Response>
}
export type DingDingNotificationPluginContext = DingDingNotificationPluginContextPart & Context

type DingDingNotificationPluginConfig = {
  webhook: string
}

export class DingDingNotificationPlugin implements Plugin {
  config: DingDingNotificationPluginConfig
  constructor(config: DingDingNotificationPluginConfig) {
    this.config = config
  }
  install(context: DingDingNotificationPluginContext) {
    context.notifyViaDingDing = async (options) => {
      context.log("DingDingNotificationPlugin", JSON.stringify(options))
      try {
        return notifyViaDingDing(this.config, options)
      } catch (err: any) {
        context.log("DingDingNotificationPlugin Error", err?.message || "error")
        throw err
      }
    }
    context.on("notify", (options: NotificationOptions) => {
      context.notifyViaDingDing(options)
    })
    context.on("error", (e) => {
      if (e?.type === "beforeInit") {
        context.notifyViaDingDing({ title: "Happy-Trading Error", body: JSON.stringify(e) })
      }
    })
  }
}

export function notifyViaDingDing(
  config: DingDingNotificationPluginConfig,
  options: NotificationOptions
) {
  return fetch(config.webhook, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      msg_type: "post",
      content: {
        post: {
          zh_cn: {
            title: options.title,
            content: [
              [
                {
                  tag: "text",
                  text: options.body,
                },
              ],
            ],
          },
        },
      },
    }),
  })
}
