import { Notification } from "../src/Notification"

describe("Notification", () => {
  it("abstract class Notification should be ok", () => {
    const notify = jest.fn(() => Promise.resolve())
    class TestNotification extends Notification {
      notify(options: any): Promise<any> {
        return notify()
      }
    }
    const testNotification = new TestNotification({})
    // @ts-ignore
    testNotification.onNotify({ log: () => {}, emit: () => {} }, { title: "test", body: "test" })
    expect(notify).toBeCalled()
  })

  it("notification level", () => {
    const notify = jest.fn(() => Promise.resolve())
    class TestNotification extends Notification {
      notify(options: any): Promise<any> {
        return notify()
      }
    }
    const testNotification = new TestNotification({}, ["alert"])
    testNotification.onNotify(
      // @ts-ignore
      { log: () => {}, emit: () => {} },
      { level: "warn", title: "test", body: "test" }
    )
    expect(notify).not.toBeCalled()
    testNotification.onNotify(
      // @ts-ignore
      { log: () => {}, emit: () => {} },
      { level: "alert", title: "test", body: "test" }
    )
    expect(notify).toBeCalled()
  })
})
