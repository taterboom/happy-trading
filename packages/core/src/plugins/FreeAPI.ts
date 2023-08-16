import { Context } from "../Context"
import { Plugin } from "../Plugin"
import sina from "../priceAPIs/sina"
import tencent from "../priceAPIs/tencent"

export class FreeAPI implements Plugin {
  static BUILT_IN_FREE_APIS = [sina, tencent]
  install(context: Context) {
    context.dataService.apis.push(...FreeAPI.BUILT_IN_FREE_APIS)
  }
}
