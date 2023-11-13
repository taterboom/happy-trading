import { CronJob } from "cron"
import dayjs, { Dayjs } from "dayjs"
import bt from "dayjs/plugin/isBetween"
import utc from "dayjs/plugin/utc"
import { Context } from "./Context"
import { Plugin } from "./Plugin"
import { FreeAPI } from "./plugins/FreeAPI"
import { Log } from "./plugins/Log"
import { processOneMinuteResult } from "./utils"

dayjs.extend(bt)
dayjs.extend(utc)

const A_MINITE = process.env.NODE_ENV === "test" ? 1 * 1000 : 60 * 1000

/**
 * new Bot().use([xxx, xxx]).start()
 */
export class Bot {
  context: Context = new Context()
  plugins: Plugin[] = []
  debug: boolean = false
  initWithPrevMinutes = 26 * 30 // 30min MACD
  _intervalId?: any
  _jobs: CronJob[] = []

  constructor(options: { codes?: string[]; debug?: boolean; initWithPrevMinutes?: number } = {}) {
    const { codes, debug = false, initWithPrevMinutes } = options
    this.debug = debug
    if (codes) {
      this.context.codes = codes
    }
    if (initWithPrevMinutes !== undefined) {
      this.initWithPrevMinutes = initWithPrevMinutes
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
    const now = dayjs.utc().utcOffset(8)
    const start1 = now.startOf("minute").set("hour", 9).set("minute", 30)
    const end1 = now.startOf("minute").set("hour", 11).set("minute", 30)
    const start2 = now.startOf("minute").set("hour", 13).set("minute", 0)
    const end2 = now.startOf("minute").set("hour", 15).set("minute", 0)

    const inTradingTime = (time: Dayjs) =>
      this.debug || time.isBetween(start1, end1) || time.isBetween(start2, end2)

    if (inTradingTime(now)) {
      try {
        await this.context.emitAsync("beforeInit")
      } catch (err) {
        this.context.emit("error", {
          type: "beforeInit",
          error: err,
        })
        this.stop()
        return
      }
      if (this.initWithPrevMinutes > 0) {
        try {
          const prevResult = await this.context.dataService.fetch(
            this.context.codes,
            this.initWithPrevMinutes
          )
          this.context.emit("initData", prevResult)
        } catch (err) {
          this.context.emit("error", {
            type: "initData",
            error: err,
          })
          this.stop()
          return
        }
      }
      let prevResult = await this.context.dataService.fetch(this.context.codes)
      const tick = () => {
        const now = dayjs()
        if (inTradingTime(now)) {
          this.context.emit("beforeTick")
          this.context.dataService
            .fetch(this.context.codes)
            .then((result) => {
              const formatedResult = processOneMinuteResult(result, prevResult)
              prevResult = result
              this.context.emit("afterTick", formatedResult)
            })
            .catch((e) => {
              this.context.emit("error", {
                type: "fetch",
                error: e,
              })
            })
        } else {
          this.context.emit("stop")
          clearInterval(id)
        }
      }
      // tick()
      const id = setInterval(tick, A_MINITE)
      this._intervalId = id
      this.context.emit("afterInit")
    }
  }

  start() {
    this.run()
    this._jobs.push(new CronJob("0 30 9 * * 1-5", () => this.run(), null, true, "Asia/Shanghai"))
    this._jobs.push(new CronJob("0 0 13 * * 1-5", () => this.run(), null, true, "Asia/Shanghai"))
  }

  stop() {
    this._jobs.forEach((job) => job.stop())
    this._jobs = []
    if (this._intervalId) {
      clearInterval(this._intervalId)
    }
  }
}
