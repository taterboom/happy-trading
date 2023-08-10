import { Context, PriceItem } from "@happy-trading/core"

export type StoragePluginContext = { getStorage: () => Promise<Database> } & Context

export type Database = {
  [code: string]: PriceItem[]
}
