export function retry<T>(fn: () => Promise<T>, times: number = 2): Promise<T> {
  return fn().catch((err) => {
    if (times > 0) {
      return retry(fn, times - 1)
    } else {
      throw err
    }
  })
}
