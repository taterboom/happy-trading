import dayjs from "dayjs"

export function log(title: string, body?: string) {
  console.log(`${dayjs().format("YYYY-MM-DD HH:mm")} [${title}] ${body || ""}`)
}
