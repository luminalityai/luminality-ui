import { describe, it, expect } from "vitest"
import { cn } from "@/lib/utils"

describe("cn", () => {
  it("returns an empty string for no inputs", () => {
    expect(cn()).toBe("")
  })

  it("ignores undefined, null, and false inputs", () => {
    expect(cn(undefined, null, false)).toBe("")
    expect(cn("foo", undefined, "bar", null, false)).toBe("foo bar")
  })

  it("joins multiple plain string class names", () => {
    expect(cn("foo", "bar", "baz")).toBe("foo bar baz")
  })

  it("applies conditional classes based on truthiness", () => {
    const isActive = true
    const isDisabled = false
    expect(cn("base", isActive && "active", isDisabled && "disabled")).toBe(
      "base active",
    )
  })

  it("supports object-style conditional classes", () => {
    expect(
      cn("base", {
        active: true,
        disabled: false,
        focused: true,
      }),
    ).toBe("base active focused")
  })

  it("flattens array inputs", () => {
    expect(cn(["foo", "bar"], ["baz"])).toBe("foo bar baz")
    expect(cn(["foo", ["bar", ["baz"]]])).toBe("foo bar baz")
  })

  it("merges conflicting Tailwind classes (later wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4")
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500")
    expect(cn("px-2 py-1", "p-4")).toBe("p-4")
  })

  it("preserves non-conflicting Tailwind classes", () => {
    expect(cn("text-red-500", "bg-blue-500")).toBe("text-red-500 bg-blue-500")
  })

  it("merges conflicts across mixed input types", () => {
    expect(cn("p-2", ["p-3", { "p-4": true, "p-6": false }], "p-5")).toBe("p-5")
  })

  it("returns a string (single string output regardless of input shape)", () => {
    expect(typeof cn("foo", ["bar"], { baz: true })).toBe("string")
  })
})
