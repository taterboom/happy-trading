import { Context, Plugin } from "@happy-trading/core"
import {
  DivergencePluginContext,
  StrategyConfig,
} from "@happy-trading/plugin-strategy/dist/divergence"
import { Client } from "@notionhq/client"

export type NotionGetInfoPluginConfig = {
  databaseId: string
  notionKey: string
}

export class NotionGetInfoPlugin implements Plugin {
  config: NotionGetInfoPluginConfig

  constructor(config: NotionGetInfoPluginConfig) {
    this.config = config
  }

  install(context: DivergencePluginContext & Context) {
    context.on("beforeInit", async () => {
      try {
        const strategies = await retry(() => this.getStrategies())
        context.DivergencePluginStrategies = strategies
        context.codes = strategies.map((item) => item.code)
      } catch (err: any) {
        context.log("NotionGetInfoPlugin", err?.message || "error")
        throw err
      }
    })
  }

  async findItems(): Promise<any[]> {
    const notion = new Client({ auth: this.config.notionKey })
    const databaseId = this.config.databaseId
    try {
      const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
          and: [
            {
              property: "code",
              title: {
                is_not_empty: true,
              },
            },
          ],
        },
      })
      return response.results
    } catch (error: any) {
      console.log("🔴 error", error.body)
      throw error.body
    }
  }

  async getStrategies(): Promise<StrategyConfig[]> {
    const results = await this.findItems()
    const items = results.map((item) => {
      const { code, level, strategy, options, extra } = item.properties
      return {
        code: code.title[0].plain_text,
        level: level.select.name,
        strategy: strategy.select.name,
        options: options.rich_text[0].plain_text.split(",").map((item: string) => Number(item)),
        extra: extra?.rich_text?.[0]?.plain_text,
      }
    })
    return items
  }
}

// retry 3 times
function retry<T = any>(fn: () => Promise<T>, times = 3): Promise<T> {
  return new Promise((resolve, reject) => {
    let count = 0
    function run() {
      fn()
        .then(resolve)
        .catch((err) => {
          count++
          if (count >= times) {
            reject(err)
          } else {
            run()
          }
        })
    }
    run()
  })
}
