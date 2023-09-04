# Happy Trading

基于核心模块和多个插件的组合，提供包括股价查询、股票监控、通知服务、股价数据存储和量化策略执行等功能。

## 模块

| 模块                | 简介                                                                        |
| ------------------- | --------------------------------------------------------------------------- |
| core                | 核心模块，提供基础的股价查询功能，为其他插件提供支持                        |
| plugin-codes        | 获取监控的股票代码插件                                                      |
| plugin-monitor      | 股价异常下降监控插件                                                        |
| plugin-notification | 通知服务插件，用于向用户发送交易相关通知，包含钉钉、邮件、Resend 等通知方式 |
| plugin-storage      | 股价数据存储插件                                                            |
| plugin-strategy     | 量化策略插件                                                                |
| utils               | 一些工具函数                                                                |

## 使用

```typescript
import { Bot } from "@happy-trading/core"
import { MonitorPlugin } from "@happy-trading/plugin-monitor"
import { DingDingNotificationPlugin } from "@happy-trading/plugin-notification/dist/DingDingNotification"
import { EmailNotificationPlugin } from "@happy-trading/plugin-notification/dist/EmailNotification"
import { JSONStoragePlugin } from "@happy-trading/plugin-storage"
import { DivergencePlugin } from "@happy-trading/plugin-strategy/dist/divergence"
import * as dotenv from "dotenv"
import { NotionGetInfoPlugin } from "./NotionGetInfoPlugin"

dotenv.config()

new Bot({ debug: process.env.NODE_ENV === "development", codes: ["000001"] })
  .use(new JSONStoragePlugin({ filepath: "./db.json" }))
  .use(
    new DingDingNotificationPlugin(
      {
        webhook: process.env.NOTIFICATION_DINGDING_WEBHOOK!,
      },
      ["warn", "alert"]
    )
  )
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
  .use(new DivergencePlugin())
  .start()
```

## 自定义插件

```typescript
import { Context, Plugin } from "@happy-trading/core"

export class FetchCodesPlugin implements Plugin {
  install(context: Context) {
    context.on("beforeInit", async () => {
      try {
        const codes = await fetch("path/to/get/codes")
        context.codes = codes
        context.log("FetchCodesPlugin", context.codes.join())
      } catch (err: any) {
        context.log("FetchCodesPlugin Error", err?.message || "error")
        throw err
      }
    })
  }
}

// new Bot()
//   .use(new FetchCodesPlugin())
//   .start()
```
