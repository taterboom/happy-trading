import { PriceItem } from "@happy-trading/core"

export type Database = {
  [code: string]: PriceItem[]
}
