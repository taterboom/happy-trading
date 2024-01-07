const mockTAMACD = jest.fn(() => ({ hist: [1] }))
jest.mock("../src/utils", () => {
  return {
    createTA: jest.fn(() => ({
      macd: mockTAMACD,
    })),
  }
})
const mockMinute = jest.fn(() => 30)
jest.mock("dayjs", () => {
  return jest.fn(() => ({
    minute: mockMinute,
  }))
})
import { execute } from "../src/MACDInversion"

describe("MACDInversion", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it("execute", () => {
    const db = {
      600030: [],
    }
    const mockNotifyInfo = jest.fn()
    mockTAMACD.mockReturnValueOnce({ hist: [1, 2, 3] })
    mockMinute.mockReturnValueOnce(30)
    execute({ db, codes: ["600030"], onOk: mockNotifyInfo })
    expect(mockNotifyInfo).toBeCalledTimes(0)
  })

  it("execute crossdown", () => {
    const db = {
      600030: [],
    }
    const mockNotifyInfo = jest.fn()
    mockTAMACD.mockReturnValueOnce({ hist: [1, 2, 1] })
    mockMinute.mockReturnValueOnce(30)
    execute({ db, codes: ["600030"], onOk: mockNotifyInfo })
    expect(mockNotifyInfo.mock.calls[0][0]?.raw?.dir).toBe("crossdown")
  })

  it("execute crossup", () => {
    const db = {
      600030: [],
    }
    const mockNotifyInfo = jest.fn()
    mockTAMACD.mockReturnValueOnce({ hist: [1, 0, 1] })
    mockMinute.mockReturnValueOnce(30)
    execute({ db, codes: ["600030"], onOk: mockNotifyInfo })
    expect(mockNotifyInfo.mock.calls[0][0]?.raw?.dir).toBe("crossup")
  })

  it("execute up", () => {
    const db = {
      600030: [],
    }
    const mockNotifyInfo = jest.fn()
    mockTAMACD.mockReturnValueOnce({ hist: [-1, 1] })
    mockMinute.mockReturnValueOnce(30)
    execute({ db, codes: ["600030"], onOk: mockNotifyInfo })
    expect(mockNotifyInfo.mock.calls[0][0]?.raw?.dir).toBe("up")
  })

  it("execute down", () => {
    const db = {
      600030: [],
    }
    const mockNotifyInfo = jest.fn()
    mockTAMACD.mockReturnValueOnce({ hist: [1, -1] })
    mockMinute.mockReturnValueOnce(30)
    execute({ db, codes: ["600030"], onOk: mockNotifyInfo })
    expect(mockNotifyInfo.mock.calls[0][0]?.raw?.dir).toBe("down")
  })
})
