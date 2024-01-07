// generated from https://github.com/taterboom/etf-utils
import NAMING from "./meta.json"

export function getName(code: string): string | undefined {
  return NAMING.find((item) => item.code === code)?.name
}
