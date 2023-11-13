import { PriceItem } from "./types"
import { retry } from "./utils"

export type PriceAPI = {
  type: "now" | "history"
  fetch: (codes: string[], prevMinutes?: number) => Promise<PriceItem[]>
}

export class DataService {
  apis: PriceAPI[] = []
  async _fetch(codes: string[], prevMinutes = 0) {
    const validApis =
      prevMinutes === 0
        ? this.apis.filter((api) => api.type === "now")
        : this.apis.filter((api) => api.type === "history")
    if (validApis.length === 0) {
      throw new Error("No API")
    }
    let apiIndex = 0
    while (apiIndex < validApis.length) {
      const api = validApis[apiIndex]
      const result = await api.fetch(codes, prevMinutes).catch((err) => {
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
  fetch(codes: string[], prevMinutes = 0) {
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
    return retry(() => this._fetch(codes, prevMinutes))
  }
}
