import { Bot } from "@happy-trading/core"
import { MonitorPlugin } from "@happy-trading/plugin-monitor"
import { DingDingNotificationPlugin } from "@happy-trading/plugin-notification/dist/DingDingNotification"
import { EmailNotificationPlugin } from "@happy-trading/plugin-notification/dist/EmailNotification"
import { MemoryStoragePlugin } from "@happy-trading/plugin-storage"
import { MACDInversion } from "@happy-trading/plugin-strategy/dist/MACDInversion"
import { Gap } from "@happy-trading/plugin-strategy/dist/gap"
import * as dotenv from "dotenv"
import { NotionGetInfoPlugin } from "./NotionGetInfoPlugin"

dotenv.config()

new Bot({ debug: process.env.NODE_ENV === "development" })
  .use(
    new NotionGetInfoPlugin({
      databaseId: process.env.NOTION_DATABASE_ID!,
      notionKey: process.env.NOTION_KEY!,
    })
  )
  // .use(new JSONStoragePlugin({ filepath: "./db.json" }))
  .use(new MemoryStoragePlugin())
  .use(
    new DingDingNotificationPlugin(
      {
        webhook: process.env.NOTIFICATION_DINGDING_WEBHOOK!,
      },
      ["warn", "alert"]
    )
  )
  // .use(
  //   new ResendNotificationPlugin({
  //     key: process.env.NOTIFICATION_RESEND_KEY!,
  //     from: process.env.NOTIFICATION_RESEND_FROM!,
  //     to: process.env.NOTIFICATION_RESEND_TO!,
  //   })
  // )
  .use(
    new EmailNotificationPlugin(
      {
        host: process.env.NOTIFICATION_EMAIL_HOST!,
        port: +process.env.NOTIFICATION_EMAIL_PORT!,
        user: process.env.NOTIFICATION_EMAIL_USER!,
        pass: process.env.NOTIFICATION_EMAIL_PASS!,
        from: process.env.NOTIFICATION_EMAIL_FROM!,
        to: process.env.NOTIFICATION_EMAIL_TO!,
      },
      ["alert"]
    )
  )
  .use(new MonitorPlugin())
  // .use(new DivergencePlugin())
  .use(new Gap())
  .use(new MACDInversion())
  .start()
