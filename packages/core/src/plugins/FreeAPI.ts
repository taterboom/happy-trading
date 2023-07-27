import { Context } from "../Context"
import { Plugin } from "../Plugin"
import sina from "../priceAPIs/sina"

export class FreeAPI implements Plugin {
  static BUILT_IN_FREE_APIS = [sina]
  install(context: Context) {
    context.dataService.apis.push(...FreeAPI.BUILT_IN_FREE_APIS)
  }
}
