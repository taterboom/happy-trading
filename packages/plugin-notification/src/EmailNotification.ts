import { Context, Plugin } from "@happy-trading/core"
import nodemailer from "nodemailer"
import { NotificationContext, NotificationOptions } from "./types"

interface EmailNotificationPluginContextPart extends NotificationContext {
  notifyViaEmail(options: NotificationOptions): Promise<void>
}
export type DingDingNotificationPluginContext = EmailNotificationPluginContextPart & Context

type EmailNotificationPluginConfig = {
  service: string
  sender: string
  senderPass: string
  from: string
  to: string
}

export class EmailNotificationPlugin implements Plugin {
  config: EmailNotificationPluginConfig
  constructor(config: EmailNotificationPluginConfig) {
    this.config = config
  }
  install(context: DingDingNotificationPluginContext) {
    context.notifyViaEmail = (options: NotificationOptions) => mailer(this.config, options)
  }
}

export async function mailer(config: EmailNotificationPluginConfig, options: NotificationOptions) {
  const { title, body } = options
  const transporter = nodemailer.createTransport({
    service: config.service,
    auth: {
      user: config.sender,
      pass: config.senderPass,
    },
  })

  await transporter.sendMail({
    from: config.from, // sender address
    to: config.to, // list of receivers
    subject: title, // Subject line
    text: body,
  })
}
