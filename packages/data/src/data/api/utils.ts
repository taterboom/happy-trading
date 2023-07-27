export const calcFixedPriceNumber = (
  open: string,
  yestclose: string,
  price: string,
  high: string,
  low: string
): number => {
  let reg = /0+$/g
  open = open.replace(reg, "")
  yestclose = yestclose.replace(reg, "")
  price = price.replace(reg, "")
  high = high.replace(reg, "")
  low = low.replace(reg, "")
  let o = open.indexOf(".") === -1 ? 0 : open.length - open.indexOf(".") - 1
  let yc = yestclose.indexOf(".") === -1 ? 0 : yestclose.length - yestclose.indexOf(".") - 1
  let p = price.indexOf(".") === -1 ? 0 : price.length - price.indexOf(".") - 1
  let h = high.indexOf(".") === -1 ? 0 : high.length - high.indexOf(".") - 1
  let l = low.indexOf(".") === -1 ? 0 : low.length - low.indexOf(".") - 1
  let max = Math.max(o, yc, p, h, l)
  if (max > 3) {
    max = 2 // 接口返回的指数数值的小数位为4，但习惯两位小数
  }
  return max
}

export const formatNumber = (val: number = 0, fixed: number = 2, format = true): string => {
  const num = +val
  if (format) {
    if (num > 1000 * 10000) {
      return (num / (10000 * 10000)).toFixed(fixed) + "亿"
    } else if (num > 1000) {
      return (num / 10000).toFixed(fixed) + "万"
    }
  }
  return `${num.toFixed(fixed)}`
}

export const randHeader = () => {
  const head_connection = ["Keep-Alive", "close"]
  const head_accept = ["text/html, application/xhtml+xml, */*"]
  const head_accept_language = [
    "zh-CN,fr-FR;q=0.5",
    "en-US,en;q=0.8,zh-Hans-CN;q=0.5,zh-Hans;q=0.3",
  ]
  const head_user_agent = [
    "Opera/8.0 (Macintosh; PPC Mac OS X; U; en)",
    "Opera/9.27 (Windows NT 5.2; U; zh-cn)",
    "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Win64; x64; Trident/4.0)",
    "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)",
    "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.2; .NET4.0C; .NET4.0E)",
    "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.2; .NET4.0C; .NET4.0E; QQBrowser/7.3.9825.400)",
    "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0; BIDUBrowser 2.x)",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1) Gecko/20070309 Firefox/2.0.0.3",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1) Gecko/20070803 Firefox/1.5.0.12",
    "Mozilla/5.0 (Windows; U; Windows NT 5.2) Gecko/2008070208 Firefox/3.0.1",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.12) Gecko/20080219 Firefox/2.0.0.12 Navigator/9.0.0.6",
    "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.95 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; rv:11.0) like Gecko)",
    "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:21.0) Gecko/20100101 Firefox/21.0 ",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Maxthon/4.0.6.2000 Chrome/26.0.1410.43 Safari/537.1 ",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.92 Safari/537.1 LBBROWSER",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.75 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.11 TaoBrowser/3.0 Safari/536.11",
    "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko",
    "Mozilla/5.0 (Macintosh; PPC Mac OS X; U; en) Opera 8.0",
  ]
  const result = {
    Connection: head_connection[0],
    Accept: head_accept[0],
    "Accept-Language": head_accept_language[1],
    "User-Agent": head_user_agent[Math.floor(Math.random() * 10)],
  }
  return result
}
