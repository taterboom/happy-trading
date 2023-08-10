import { Context, Plugin } from "@happy-trading/core"
import nodemailer from "nodemailer"
import { NotificationContext, NotificationOptions } from "./types"

interface EmailNotificationPluginContextPart extends NotificationContext {
  notifyViaEmail(options: NotificationOptions): Promise<void>
}
export type DingDingNotificationPluginContext = EmailNotificationPluginContextPart & Context

type EmailNotificationPluginConfig = {
  host: string
  port: number
  user: string
  pass: string
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
    context.on("notify", (options: NotificationOptions) => {
      context.notifyViaEmail(options)
    })
  }
}

export async function mailer(config: EmailNotificationPluginConfig, options: NotificationOptions) {
  const { title, body } = options
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: true,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  })

  await transporter.sendMail({
    from: config.from, // sender address
    to: config.to, // list of receivers
    subject: title, // Subject line
    text: body,
  })
}
