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

  // http://qt.gtimg.cn/?q=sh000001,sh000300,sz399001,sz399006,hkHSI,hkHSCEI,usDJI,usINX,usIXIC
  const res = await fetch(`http://qt.gtimg.cn/q=${codes.join(",")}`)
    .then((res) => res.arrayBuffer())
    .then((buf) => decode(Buffer.from(buf), "GB18030"))

  const codeChunks = res.split(";").filter((item) => !!item && item.includes("~"))
  const priceItems = codeChunks.map((item) => {
    const values = item.split("~")
    // "100~恒生科技指数~HSTECH~3944.370~3981.270~4004.870~981752.2619~0~0~3944.370~0~0~0~0~0~0~0~0~0~3944.370~0~0~0~0~0~0~0~0~0~0.0~2023/11/14 13:06:02~-36.900~-0.93~4010.060~3940.310~3944.370~981752.2619~981752.262~0~0~~0~0~1.75~0~0~Hang Seng TECH Index~0~4825.590~3313.730~0.95~1.19~0~0~0~0~0~0.00~0.00~0.00~0~-4.47~-2.75~ZS~~~4.93~3.48~-4.41~0.00~0.00~0.00~0.000~~-5.14~HKD~1~";
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
