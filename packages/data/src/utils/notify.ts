import { exec } from "node:child_process"

export function displayNotificationOnMac(title: string, body: string) {
  exec(
    `osascript -e 'display alert "${title}" message "${body}" buttons {"OK", "Cancel"} default button "OK" cancel button "Cancel"'`
  )
  // exec(`osascript -e 'display notification "${body}" with title "${title}"' giving up after 35`)
}
