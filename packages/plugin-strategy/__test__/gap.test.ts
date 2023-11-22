const mockProcessStockData = jest.fn()
jest.mock("@happy-trading/utils", () => {
  return {
    processStockData: mockProcessStockData,
  }
})

import { execute } from "../src/gap"

describe("execute function", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it("should call onOk with up direction when last open is greater than previous high", () => {
    const mockOnOk = jest.fn()
    mockProcessStockData.mockReturnValueOnce({
      5: [
        {
          open: 23,
          high: 23,
          low: 23,
          close: 23,
          time: "2021-01-01 15:00:00",
          code: "600030",
          volume: 1,
          amount: 1,
        },
        {
          open: 25,
          high: 25,
          low: 25,
          close: 25,
          time: "2021-01-02 09:35:00",
          code: "600030",
          volume: 1,
          amount: 1,
        },
      ],
    })

    execute({
      db: { "600030": [] },
      threshold: 1,
      codes: ["600030"],
      onOk: mockOnOk,
    })

    expect(mockOnOk.mock.calls[0][0]?.raw).toMatchObject({
      dir: "up",
      diff: 2,
    })
  })

  it("should call onOk with down direction when last open is less than previous low", () => {
    const mockOnOk = jest.fn()
    mockProcessStockData.mockReturnValueOnce({
      5: [
        {
          open: 23,
          high: 23,
          low: 23,
          close: 23,
          time: "2021-01-01 15:00:00",
          code: "600030",
          volume: 1,
          amount: 1,
        },
        {
          open: 21,
          high: 21,
          low: 21,
          close: 21,
          time: "2021-01-02 09:35:00",
          code: "600030",
          volume: 1,
          amount: 1,
        },
      ],
    })

    execute({
      db: { "600030": [] },
      threshold: 1,
      codes: ["600030"],
      onOk: mockOnOk,
    })

    expect(mockOnOk.mock.calls[0][0]?.raw).toMatchObject({
      dir: "down",
      diff: 2,
    })
  })

  it("should not call onOk when the difference is less than the threshold", () => {
    const mockOnOk = jest.fn()
    mockProcessStockData.mockReturnValueOnce({
      5: [
        {
          open: 23,
          high: 23,
          low: 23,
          close: 23,
          time: "2021-01-01 15:00:00",
          code: "600030",
          volume: 1,
          amount: 1,
        },
        {
          open: 22.5,
          high: 22.5,
          low: 22.5,
          close: 22.5,
          time: "2021-01-02 09:35:00",
          code: "600030",
          volume: 1,
          amount: 1,
        },
      ],
    })

    execute({
      db: { "600030": [] },
      threshold: 1,
      codes: ["600030"],
      onOk: mockOnOk,
    })

    expect(mockOnOk).not.toHaveBeenCalled()
  })
})
