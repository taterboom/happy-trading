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
      const strategies = await this.getStrategies()
      context.DivergencePluginStrategies = strategies
      context.codes = strategies.map((item) => item.code)
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
