import eastmoney from "../src/priceAPIs/eastmoney"
import sina from "../src/priceAPIs/sina"
import tencent from "../src/priceAPIs/tencent"

// local test only
describe.skip("FreeAPI", () => {
  it("sina A", () => {
    return sina(["sh601127"]).then((data) => {
      expect(data.length).toBe(1)
      expect(data[0]).toHaveProperty("code", "601127")
      expect(data[0]).toHaveProperty("close")
    })
  })

  it("sina HK", () => {
    return sina(["hkHSTECH"]).then((data) => {
      expect(data.length).toBe(1)
      expect(data[0]).toHaveProperty("code", "hkHSTECH")
      expect(data[0]).toHaveProperty("close")
    })
  })

  it("tencent A", () => {
    return tencent(["000001", "000002"]).then((data) => {
      expect(data.length).toBe(2)
      expect(data[0]).toHaveProperty("code", "000001")
      expect(data[0]).toHaveProperty("close")
    })
  })

  it("tencent HK", () => {
    return sina(["hkHSTECH"]).then((data) => {
      expect(data.length).toBe(1)
      expect(data[0]).toHaveProperty("code", "hkHSTECH")
      expect(data[0]).toHaveProperty("close")
    })
  })

  it("eastmoney A", () => {
    return eastmoney.get_latest_ndays_quotes(["000001"]).then((data) => {
      expect(data[0]).toHaveProperty("code", "000001")
      expect(data[0]).toHaveProperty("close")
    })
  })

  it("eastmoney HK", () => {
    return eastmoney.get_latest_ndays_quotes(["hkHSTECH"]).then((data) => {
      console.log(data)
      expect(data.length).toBe(1)
      expect(data[0]).toHaveProperty("code", "hkHSTECH")
      expect(data[0]).toHaveProperty("close")
    })
  })
})
