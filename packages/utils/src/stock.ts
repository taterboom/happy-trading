import { PriceItem } from "@happy-trading/core"
import dayjs from "dayjs"

function computeChunkData(chunk: PriceItem[]) {
  const code = chunk[0].code
  const open = chunk[0].close
  const close = chunk[chunk.length - 1].close
  const high = Math.max(...chunk.map((data) => data.close))
  const low = Math.min(...chunk.map((data) => data.close))
  const time = chunk[chunk.length - 1].time
  const amount = chunk.reduce((acc, cur) => acc + cur.amount, 0)
  const volume = chunk.reduce((acc, cur) => acc + cur.volume, 0)
  return {
    code,
    open,
    high,
    low,
    close,
    time,
    amount,
    volume,
  }
}

// stockData 没有重复，且是按照时间顺序排列的
export function processStockData(stockData: PriceItem[]) {
  const fiveMinuteData: PriceItem[] = []
  const thirtyMinuteData: PriceItem[] = []

  for (let i = 0; i < stockData.length; i++) {
    const oneMinuteData = stockData[i]
    const minute = dayjs(oneMinuteData.time).minute()

    if (minute % 5 === 0) {
      fiveMinuteData.push(computeChunkData(stockData.slice(Math.max(i - 4, 0), i + 1)))
    }

    if (minute % 30 === 0) {
      thirtyMinuteData.push(computeChunkData(stockData.slice(Math.max(i - 29, 0), i + 1)))
    }
  }

  return {
    5: fiveMinuteData,
    30: thirtyMinuteData,
  }
}

// sh prefix: 5, 6
// sz prefix: 0, 1, 3
export function formatCode(code: string) {
  if (code.startsWith("sh") || code.startsWith("sz") || code.startsWith("hk")) return code
  return /^(5|6)/.test(code) ? `sh${code}` : `sz${code}`
}

export function parseCode(code: string) {
  return code.match(/(\d{6})/)?.[0] || code
}
