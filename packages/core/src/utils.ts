import { PriceItem } from "./types"

export function retry<T>(fn: () => Promise<T>, times: number = 2): Promise<T> {
  return fn().catch((err) => {
    if (times > 0) {
      return retry(fn, times - 1)
    } else {
      throw err
    }
  })
}

export function processOneMinuteResult(result: PriceItem[], prevResult?: PriceItem[]) {
  if (!prevResult) return result
  return result.map((item, index) => {
    const prevItem = prevResult[index]
    if (prevItem) {
      return {
        ...item,
        open: item.close,
        high: item.close,
        low: item.close,
        amount: item.amount && prevItem.amount ? item.amount - prevItem.amount : 0,
        volume: item.volume && prevItem.volume ? item.volume - prevItem.volume : 0,
      } as PriceItem
    }
    return item
  })
}

export function pick(obj: any, keys: string[]) {
  return keys.reduce((ret, key) => {
    ret[key] = obj[key]
    return ret
  }, {} as any)
}

export function formatCode(code: string) {
  return code.startsWith("6") ? `sh${code}` : `sz${code}`
}

export function parseCode(code: string) {
  return code.match(/(\d{6})/)?.[0] || code
}
