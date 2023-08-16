import dayjs from "dayjs"
import tz from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { decode } from "iconv-lite"
import { PriceItem } from "../types"
import { formatCode } from "../utils"

dayjs.extend(utc)
dayjs.extend(tz)

export default async function getStockData(rawCodes: Array<string>): Promise<Array<PriceItem>> {
  if ((rawCodes && rawCodes.length === 0) || !rawCodes) {
    return []
  }
  const codes = rawCodes.map(formatCode)

  const res = await fetch(`http://qt.gtimg.cn/q=${codes.join(",")}`)
    .then((res) => res.arrayBuffer())
    .then((buf) => decode(Buffer.from(buf), "GB18030"))

  const codeChunks = res.split(";").filter((item) => !!item && item.includes("~"))
  const priceItems = codeChunks.map((item) => {
    const values = item.split("~")
    const info: PriceItem = {
      time: dayjs
        .tz(dayjs(values[30], "YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss"), "Asia/Shanghai")
        .format(),
      // name: values[1],
      code: values[2],
      close: +values[3],
      open: +values[5],
      high: +values[33],
      low: +values[34],
      volume: +values[6],
      amount: +values[37],
    }
    return info
  })
  return priceItems
}
