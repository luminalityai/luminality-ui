import { describe, it, expect } from "vitest"
import { parseJsonError, formatJson } from "@/lib/json-utils"

describe("parseJsonError", () => {
  it("returns message from SyntaxError", () => {
    const error = new SyntaxError("Unexpected token")
    expect(parseJsonError(error)).toBe("Unexpected token")
  })

  it("returns generic message for non-SyntaxError", () => {
    expect(parseJsonError(new Error("other"))).toBe("Invalid JSON")
  })
})

describe("formatJson", () => {
  it("pretty-prints an object", () => {
    expect(formatJson({ a: 1 })).toBe('{\n  "a": 1\n}')
  })

  it("pretty-prints an array", () => {
    expect(formatJson([1, 2])).toBe('[\n  1,\n  2\n]')
  })
})
