import nodemailer from "nodemailer"
import { Notification } from "./Notification"
import { NotificationOptions } from "./types"

type EmailNotificationPluginConfig = {
  host: string
  port: number
  user: string
  pass: string
  from: string
  to: string
}

export class EmailNotificationPlugin extends Notification<EmailNotificationPluginConfig> {
  notify(options: NotificationOptions<any>): Promise<any> {
    return mailer(this.config, options)
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
