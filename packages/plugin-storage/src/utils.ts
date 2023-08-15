import { PriceItem } from "@happy-trading/core"
import dayjs from "dayjs"
import { Database } from "./types"

// simple insert or append
export function simpleInsert(items: PriceItem[], item: PriceItem) {
  if (items.length === 0) {
    items.push(item)
    return items
  }
  const lastItem = items[items.length - 1]
  const lastTime = dayjs(lastItem.time)
  const secondLastTime = items[items.length - 2] && dayjs(items[items.length - 2].time)
  const thisTime = dayjs(item.time)
  if (lastTime.isSame(thisTime, "minute")) {
    // replace last item
    items[items.length - 1] = item
  } else if (lastTime.isBefore(thisTime, "minute")) {
    // append
    items.push(item)
  } else if (secondLastTime && secondLastTime.isBefore(thisTime, "minute")) {
    // insert before last item
    items.splice(items.length - 1, 0, item)
  }
  return items
}

export function simpleInsertInDb(db: Database, item: PriceItem, maxSize: number) {
  const { code } = item
  if (!db[code]) {
    db[code] = [item]
  } else {
    if (db[code].length >= maxSize) {
      db[code].shift()
    }
    simpleInsert(db[code], item)
  }
}
