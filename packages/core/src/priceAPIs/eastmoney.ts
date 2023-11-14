// https://github.dev/Micro-sheep/efinance/blob/main/efinance/common/getter.py

import { PriceItem } from "../types"
import { parseCode } from "../utils"
import { MINUTES_PER_DAY, minute2day } from "./utils"

const MARKET_NUMBER_DICT = {
  "0": "深A",
  "1": "沪A",
  "105": "美股",
  "106": "美股",
  "107": "美股",
  "116": "港股",
  "128": "港股",
  "113": "上期所",
  "114": "大商所",
  "115": "郑商所",
  "8": "中金所",
  "142": "上海能源期货交易所",
  "155": "英股",
  "90": "板块",
  "225": "广期所",
}

const EASTMONEY_QUOTE_FIELDS = {
  f12: "代码",
  f14: "名称",
  f3: "涨跌幅",
  f2: "最新价",
  f15: "最高",
  f16: "最低",
  f17: "今开",
  f4: "涨跌额",
  f8: "换手率",
  f10: "量比",
  f9: "动态市盈率",
  f5: "成交量",
  f6: "成交额",
  f18: "昨日收盘",
  f20: "总市值",
  f21: "流通市值",
  f13: "市场编号",
  f124: "更新时间戳",
  f297: "最新交易日",
}

const EASTMONEY_KLINE_NDAYS_FIELDS = {
  f51: "time",
  f52: "open",
  f53: "close",
  f54: "high",
  f55: "low",
  f56: "volume",
  f57: "amount",
}

const EASTMONEY_REQUEST_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; rv:11.0) like Gecko",
  Accept: "*/*",
  "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
}

// see: https://github.dev/Micro-sheep/efinance/blob/main/efinance/common/getter.py
// 通过接口查询前面的数字.
// url = 'https://searchapi.eastmoney.com/api/suggest/get'
// params = (
//   ('input', f'{keyword}'),
//   ('type', '14'),
//   ('token', 'D43BF722C8E33BDC906FB84D85E326E8'),
//   ('count', f'{count}'),
// )
function get_quote_id(code: string) {
  if (code.startsWith("hk")) {
    return `124.${code.slice(2)}`
  } else if (code.startsWith("6")) {
    return `1.${code}`
  } else {
    return `0.${code}`
  }
}

// ndays: max 5
async function get_latest_ndays_quote(
  _code: string,
  prevMinutes = MINUTES_PER_DAY
): Promise<PriceItem[]> {
  const code = parseCode(_code)
  const fields = Object.keys(EASTMONEY_KLINE_NDAYS_FIELDS)
  const fields2 = fields.join(",")
  const params = {
    fields1: "f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13",
    fields2: fields2,
    ndays: minute2day(prevMinutes),
    iscr: "0",
    iscca: "0",
    secid: get_quote_id(code),
  }
  const url = `http://push2his.eastmoney.com/api/qt/stock/trends2/get?${Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join(`&`)}`
  const res = await fetch(url).then((res) => res.json())
  const data = res.data.trends.map((trend: string) => {
    const chunks = trend.split(",")
    const keys = Object.values(EASTMONEY_KLINE_NDAYS_FIELDS)
    const item = chunks.reduce((acc: any, cur: any, idx: number) => {
      const key = keys[idx]
      acc[key] = cur
      return acc
    }, {})
    item.code = code
    return item
  })
  return data
}

const get_latest_ndays_quotes = (codes: string[], prevMinutes?: number) =>
  Promise.all(codes.map((code) => get_latest_ndays_quote(code, prevMinutes))).then((data) =>
    data.flat()
  )

const eastmoney = {
  get_latest_ndays_quotes,
}

export default eastmoney
