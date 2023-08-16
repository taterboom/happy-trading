import { Context, Plugin } from "@happy-trading/core"
import { Resend } from "resend"
import { NotificationContext, NotificationOptions } from "./types"

interface ResendNotificationPluginContextPart extends NotificationContext {
  notifyViaResend(options: NotificationOptions): Promise<any>
}
export type ResendNotificationPluginContext = ResendNotificationPluginContextPart & Context

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
  install(context: ResendNotificationPluginContext) {
    context.notifyViaResend = (options: NotificationOptions) => {
      context.log("ResendNotificationPlugin", JSON.stringify(options))
      try {
        return resend(this.config, options)
      } catch (err: any) {
        context.log("ResendNotificationPlugin Error", err?.message || "error")
        throw err
      }
    }
    context.on("notify", (options: NotificationOptions) => {
      context.notifyViaResend(options)
    })
    context.on("error", (e) => {
      if (e?.type === "beforeInit") {
        context.notifyViaResend({ title: "Happy-Trading Error", body: JSON.stringify(e) })
      }
    })
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
