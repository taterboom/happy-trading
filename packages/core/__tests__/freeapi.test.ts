import fs from "node:fs/promises"
import eastmoney from "../src/priceAPIs/eastmoney"
import sina from "../src/priceAPIs/sina"
import tencent from "../src/priceAPIs/tencent"

// local test only
describe.skip("FreeAPI", () => {
  it("sina", () => {
    return sina(["sh601127"]).then((data) => {
      expect(data.length).toBe(1)
      expect(data[0]).toHaveProperty("code", "601127")
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

  it("eastmoney", () => {
    return eastmoney.get_latest_ndays_quotes(["000001", "000002"]).then((data) => {
      console.log(data)
      fs.writeFile("eastmoney.json", JSON.stringify(data, null, 2))
      expect(data.length).toBe(2)
      expect(data[0]).toHaveProperty("code", "000001")
      expect(data[0]).toHaveProperty("close")
    })
  })
})
