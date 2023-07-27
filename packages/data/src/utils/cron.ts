import { CronJob } from "cron"

export function startCron(callback: () => void) {
  new CronJob("0 30 9 * * 1-5", callback, null, true, "Asia/Shanghai")
  new CronJob("0 0 13 * * 1-5", callback, null, true, "Asia/Shanghai")
}
