import { Resend } from "resend"
import { Notification } from "./Notification"
import { NotificationOptions } from "./types"

type ResendNotificationPluginConfig = {
  key: string
  from: string
  to: string
}

export class ResendNotificationPlugin extends Notification<ResendNotificationPluginConfig> {
  notify(options: NotificationOptions<any>): Promise<any> {
    return resend(this.config, options)
  }
}

export async function resend(config: ResendNotificationPluginConfig, options: NotificationOptions) {
  const resend = new Resend(config.key)

  return await resend.emails.send({
    from: config.from,
    to: config.to,
    subject: options.title,
    html: options.body,
  })
}
