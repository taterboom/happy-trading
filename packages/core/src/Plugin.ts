import { Context } from "./Context"

export interface Plugin {
  install(context: Context): void
}
