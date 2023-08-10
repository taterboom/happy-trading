import { Context } from "@happy-trading/core"

export type NotificationContext = Context<{ notify: NotificationOptions }>

export interface NotificationOptions<T = any> {
  title: string
  body: string
  raw: T
}
