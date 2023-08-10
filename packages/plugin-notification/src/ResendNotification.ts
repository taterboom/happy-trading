import { Context, Plugin } from "@happy-trading/core"
import { Resend } from "resend"
import { NotificationContext, NotificationOptions } from "./types"

interface ResendNotificationPluginContextPart extends NotificationContext {
  notifyViaResend(options: NotificationOptions): Promise<any>
}
export type DingDingNotificationPluginContext = ResendNotificationPluginContextPart & Context

type ResendNotificationPluginConfig = {
  key: string
  from: string
  to: string
}

export class ResendNotificationPlugin implements Plugin {
  config: ResendNotificationPluginConfig
  constructor(config: ResendNotificationPluginConfig) {
    this.config = config
  }
  install(context: DingDingNotificationPluginContext) {
    context.notifyViaResend = (options: NotificationOptions) => resend(this.config, options)
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
