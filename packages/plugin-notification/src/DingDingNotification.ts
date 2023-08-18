import { Notification } from "./Notification"
import { NotificationOptions } from "./types"

type DingDingNotificationPluginConfig = {
  webhook: string
}

export class DingDingNotificationPlugin extends Notification<DingDingNotificationPluginConfig> {
  notify(options: NotificationOptions<any>): Promise<any> {
    return notifyViaDingDing(this.config, options)
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
