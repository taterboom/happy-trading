import { PriceItem } from "./types"
import { retry } from "./utils"

export type PriceAPI = (codes: string[]) => Promise<PriceItem[]>

export class DataService {
  apis: PriceAPI[] = []
  async _fetch(codes: string[]) {
    let apiIndex = 0
    while (apiIndex < this.apis.length) {
      const api = this.apis[apiIndex]
      const result = await api(codes).catch((err) => {
        console.error("🔴", err)
        return null
      })
      if (result) {
        return result
      }
      apiIndex += 1
    }
    throw new Error("No API")
  }
  fetch(codes: string[]) {
    if (process.env.NODE_ENV === "test") {
      return Promise.resolve<PriceItem[]>(
        codes.map((code) => ({
          code,
          time: new Date().toISOString(),
          close: 1,
          high: 1,
          low: 1,
          open: 1,
          volume: 0,
          amount: 0,
        }))
      )
    }
    return retry(() => this._fetch(codes))
  }
}
