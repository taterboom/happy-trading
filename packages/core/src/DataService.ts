import { retry } from "./utils"

export type PriceItem = {
  time: string
  code: string
  open: number
  close: number
  high: number
  low: number
  volume: number
  amount: number
}

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
    return retry(() => this._fetch(codes))
  }
}
