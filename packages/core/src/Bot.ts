import { CronJob } from "cron"
import dayjs, { Dayjs } from "dayjs"
import bt from "dayjs/plugin/isBetween"
import utc from "dayjs/plugin/utc"
import { Context } from "./Context"
import { Plugin } from "./Plugin"
import { FreeAPI } from "./plugins/FreeAPI"
import { Log } from "./plugins/Log"

dayjs.extend(bt)
dayjs.extend(utc)

const A_MINITE = 60 * 1000

/**
 * new Bot().use([xxx, xxx]).start()
 */
export class Bot {
  static BUILT_IN_PLUGINS: Plugin[] = []

  context: Context = new Context()
  plugins: Plugin[] = [...Bot.BUILT_IN_PLUGINS]
  debug: boolean = false

  constructor(options: { codes?: string[]; debug?: boolean } = {}) {
    const { codes, debug = false } = options
    this.debug = debug
    if (codes) {
      this.context.codes = codes
    }
    this.use([new FreeAPI(), new Log()])
  }

  use(maybePlugins: Plugin | Plugin[]) {
    const plugins = Array.isArray(maybePlugins) ? maybePlugins : [maybePlugins]
    plugins.forEach((plugin) => {
      this.plugins.push(plugin)
      plugin.install(this.context)
    })
    return this
  }

  async run() {
    const now = dayjs().utc().utcOffset(8)
    const start1 = now.startOf("minute").set("hour", 9).set("minute", 30)
    const end1 = now.startOf("minute").set("hour", 11).set("minute", 30)
    const start2 = now.startOf("minute").set("hour", 13).set("minute", 0)
    const end2 = now.startOf("minute").set("hour", 15).set("minute", 0)

    const inTradingTime = (time: Dayjs) =>
      this.debug || time.isBetween(start1, end1) || time.isBetween(start2, end2)

    if (inTradingTime(now)) {
      await this.context.emitAsync("beforeInit")
      // TODO 提前获取前 30 分钟的数据
      // initDB(codes, options).then((db) => {
      //   options.onInit?.(db)
      // })
      const tick = () => {
        const now = dayjs()
        if (inTradingTime(now)) {
          this.context.emit("beforeTick")
          this.context.dataService.fetch(this.context.codes).then((result) => {
            this.context.emit("afterTick", result)
          })
        } else {
          this.context.emit("stop")
          clearInterval(id)
        }
      }
      tick()
      const id = setInterval(tick, A_MINITE)
      this.context.emit("afterInit")
    }
  }

  start() {
    this.run()
    new CronJob("0 30 9 * * 1-5", () => this.run(), null, true, "Asia/Shanghai")
    new CronJob("0 0 13 * * 1-5", () => this.run(), null, true, "Asia/Shanghai")
  }
}
