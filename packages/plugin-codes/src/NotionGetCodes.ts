import { Context, Plugin } from "@happy-trading/core"
import { Client } from "@notionhq/client"

export type NotionGetCodesPluginConfig = {
  databaseId: string
  notionKey: string
}

export class NotionGetCodesPlugin implements Plugin {
  config: NotionGetCodesPluginConfig
  constructor(config: NotionGetCodesPluginConfig) {
    this.config = config
  }
  install(context: Context) {
    context.on("beforeInit", async () => {
      const codes = await this.getCodes()
      context.codes = codes
    })
  }

  async findItems(): Promise<any[]> {
    const notion = new Client({ auth: process.env.NOTION_KEY })
    const databaseId = process.env.NOTION_DATABASE_ID!
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

  async getCodes() {
    const results = await this.findItems()
    const items = results.map((item) => {
      const { code } = item.properties
      return code.title[0].plain_text
    })
    return items
  }
}
