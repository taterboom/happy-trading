import { Context } from "../Context"
import { PriceAPI } from "../DataService"
import { Plugin } from "../Plugin"
import eastmoney from "../priceAPIs/eastmoney"
import sina from "../priceAPIs/sina"
import tencent from "../priceAPIs/tencent"

export class FreeAPI implements Plugin {
  static BUILT_IN_FREE_APIS: PriceAPI[] = [
    { fetch: sina, type: "now" },
    { fetch: tencent, type: "now" },
    {
      fetch: eastmoney.get_latest_ndays_quotes,
      type: "history",
    },
  ]
  install(context: Context) {
    context.dataService.apis.push(...FreeAPI.BUILT_IN_FREE_APIS)
  }
}
