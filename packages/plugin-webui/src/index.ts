import { Context, Plugin } from "@happy-trading/core"
import { LogEventParams } from "@happy-trading/core/dist/plugins/Log"
import { NotificationContext, NotificationOptions } from "@happy-trading/plugin-notification"
import { StoragePluginContext } from "@happy-trading/plugin-storage"
import express, { Express } from "express"

type WebuiConfig = {
  app: Express
  prefix?: string
}

type CacheItem =
  | {
      type: "log"
      data: LogEventParams
      from?: string
    }
  | {
      type: "notification"
      data: NotificationOptions
      from?: string
    }

type WebuiContext = StoragePluginContext & NotificationContext & Context

export class Webui implements Plugin {
  config: WebuiConfig
  constructor(config: WebuiConfig) {
    this.config = {
      prefix: "/webui",
      ...config,
    }
  }
  cache: CacheItem[] = []
  install(context: WebuiContext): void {
    context.on("notify", async (result: NotificationOptions) => {
      this.cache.push({
        type: "notification",
        data: result,
        from: result.from,
      })
    })
    context.on("log", async (result: any) => {
      this.cache.push({
        type: "log",
        data: result,
        from: result.from,
      })
    })
  }
  setupRouter(context: WebuiContext) {
    const router = express.Router()
    this.config.app.use(this.config.prefix!, router)

    router.get("/db", async (req, res) => {
      const db = await context.getStorage()
      res.json(db)
    })

    router.get("/dashboard", (req, res) => {
      // TODO render dashboard
      res.json(this.cache)
    })
  }
}
