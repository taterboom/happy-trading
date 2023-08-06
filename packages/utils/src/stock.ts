import { PriceItem } from "@happy-trading/core"

function computeChunkData(chunk: PriceItem[]) {
  const code = chunk[0].code
  const open = chunk[0].open
  const close = chunk[chunk.length - 1].close
  const high = Math.max(...chunk.map((data) => data.high))
  const low = Math.min(...chunk.map((data) => data.low))
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

export function processStockData(stockData: PriceItem[]) {
  const fiveMinuteData: PriceItem[] = []
  const thirtyMinuteData: PriceItem[] = []

  let fiveMinuteChunk: PriceItem[] = []
  let thirtyMinuteChunk: PriceItem[] = []

  for (let i = 0; i < stockData.length; i++) {
    const minuteData = stockData[i]

    // Add minute data to the 5-minute chunk
    fiveMinuteChunk.push(minuteData)

    // Add minute data to the 30-minute chunk
    thirtyMinuteChunk.push(minuteData)

    // Check if 5 minutes have passed
    if (fiveMinuteChunk.length === 5) {
      fiveMinuteData.push(computeChunkData(fiveMinuteChunk))
      fiveMinuteChunk = []
    }

    // Check if 30 minutes have passed
    if (thirtyMinuteChunk.length === 30) {
      thirtyMinuteData.push(computeChunkData(thirtyMinuteChunk))
      thirtyMinuteChunk = []
    }
  }

  return {
    fiveMinuteData,
    thirtyMinuteData,
  }
}
