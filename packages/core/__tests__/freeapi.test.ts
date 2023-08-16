import sina from "../src/priceAPIs/sina"
import tencent from "../src/priceAPIs/tencent"

describe("FreeAPI", () => {
  it("sina", () => {
    return sina(["000001", "000002"]).then((data) => {
      expect(data.length).toBe(2)
      expect(data[0]).toHaveProperty("code", "000001")
      expect(data[0]).toHaveProperty("close")
    })
  })

  it("tencent", () => {
    return tencent(["000001", "000002"]).then((data) => {
      expect(data.length).toBe(2)
      expect(data[0]).toHaveProperty("code", "000001")
      expect(data[0]).toHaveProperty("close")
    })
  })
})
