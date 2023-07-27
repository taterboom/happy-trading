// db
// (codes) => get price => hook

import { pick } from "lodash"
import { log } from "../utils/log"
import { getStockData } from "./api/sina"

// [price, high, low]
type KItemPrice = number
type KItemHigh = number
type KItemLow = number
export type KItem = [KItemPrice, KItemHigh, KItemLow]

type Code = string
export type Database = Record<Code, { 1: KItem[]; 5: KItem[]; 30: KItem[] }>
const db: Database = {}

export async function fetchAndSave(time: number, codes: Code[]) {
  try {
    const data = await getStockData(codes)
    data.forEach((result, index) => {
      const currentData = db[codes[index]] || { 1: [], 5: [], 30: [] }
      const { price: priceStr } = result
      const price = +priceStr
      const kItem: KItem = [price, 0, 0]
      const k1Items = currentData[1].concat([kItem])
      const k5Items = currentData[5]
      const k30Items = currentData[30]
      if (time % 5 === 0) {
        const last5KItems = k1Items.slice(Math.max(0, k1Items.length - 5), k1Items.length)
        const k5Item: KItem = [
          price,
          Math.max(...last5KItems.map((item) => item[0])),
          Math.min(...last5KItems.map((item) => item[0])),
        ]
        k5Items.push(k5Item)
      }
      if (time % 30 === 0) {
        const last30KItems = k1Items.slice(Math.max(0, k1Items.length - 30), k1Items.length)
        const k30Item: KItem = [
          price,
          Math.max(...last30KItems.map((item) => item[0])),
          Math.min(...last30KItems.map((item) => item[0])),
        ]
        k30Items.push(k30Item)
      }
      db[codes[index]] = {
        1: k1Items,
        5: k5Items,
        30: k30Items,
      }
    })
    return db
  } catch (err) {
    // @ts-ignore
    log("🚧 error", err?.message)
  }
}

export function saveDB(options: { write: (content: string) => any }) {
  const toBeSaved = Object.entries(db).reduce((acc, [key, value]) => {
    acc[key] = {
      1: value[1].slice(Math.max(0, value[1].length - 240), value[1].length),
      5: value[5].slice(Math.max(0, value[5].length - 48), value[5].length),
      30: value[30].slice(Math.max(0, value[30].length - 8), value[30].length),
    }
    return acc
  }, {} as Record<string, { 1: KItem[]; 5: KItem[]; 30: KItem[] }>)
  options.write(JSON.stringify(toBeSaved))
  // fs.writeFile("./log/db.json", JSON.stringify(toBeSaved), "utf8")
}

export async function initDB(codes: string[], options: { read: () => any }) {
  try {
    const dbStr = await options.read()
    log("init", "db.json found")
    Object.assign(db, pick(JSON.parse(dbStr), codes))
    return db
  } catch (err) {
    log("init", "db.json not found")
    throw err
  }
}
