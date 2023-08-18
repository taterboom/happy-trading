export type NotificationLevel = "remind" | "warn" | "alert"

export interface NotificationOptions<T = any> {
  level?: NotificationLevel
  title: string
  body: string
  raw?: T
}
