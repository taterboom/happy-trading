import { Context, Plugin } from "@happy-trading/core"
import { NotificationContext, NotificationOptions } from "./types"

interface DingDingNotificationPluginContextPart extends NotificationContext {
  notifyViaDingDing(options: NotificationOptions): Promise<Response>
}
export type DingDingNotificationPluginContext = DingDingNotificationPluginContextPart & Context

type DingDingNotificationPluginConfig = {
  hook: string
}

export class DingDingNotificationPlugin implements Plugin {
  config: DingDingNotificationPluginConfig
  constructor(config: DingDingNotificationPluginConfig) {
    this.config = config
  }
  install(context: DingDingNotificationPluginContext) {
    context.notifyViaDingDing = async (options) => {
      return notifyViaDingDing(this.config, options)
    }
    context.on("notify", (options: NotificationOptions) => {
      context.notifyViaDingDing(options)
    })
  }
}

export function notifyViaDingDing(
  config: DingDingNotificationPluginConfig,
  options: NotificationOptions
) {
  return fetch(config.hook, {
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
