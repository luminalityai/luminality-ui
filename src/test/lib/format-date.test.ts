import { describe, it, expect } from "vitest"
import {
  formatDate,
  formatDateTime,
  formatDateTimeWithTimezone,
  formatRelativeTime,
  getLocalTimezone,
} from "@/lib/format-date"

describe("formatDate", () => {
  it("formats ISO date string", () => {
    expect(formatDate("2024-06-15T12:00:00Z", "UTC")).toBe("2024.06.15")
  })

  it("returns em dash for null", () => {
    expect(formatDate(null)).toBe("—")
  })

  it("returns em dash for invalid date", () => {
    expect(formatDate("not-a-date")).toBe("—")
  })
})

describe("formatDateTime", () => {
  it("formats date and time", () => {
    expect(formatDateTime("2024-06-15T14:30:00Z", false, "UTC")).toBe(
      "2024.06.15 14:30",
    )
  })

  it("includes timezone when requested", () => {
    const result = formatDateTime("2024-06-15T14:30:00Z", true, "UTC")
    expect(result).toContain("2024.06.15 14:30")
    expect(result).toContain("UTC")
  })
})

describe("formatDateTimeWithTimezone", () => {
  it("always includes timezone", () => {
    const result = formatDateTimeWithTimezone("2024-06-15T14:30:00Z", "UTC")
    expect(result).toContain("UTC")
  })
})

describe("formatRelativeTime", () => {
  it("returns em dash for null", () => {
    expect(formatRelativeTime(null)).toBe("—")
  })

  it("returns relative time string", () => {
    const recent = new Date(Date.now() - 60000).toISOString()
    expect(formatRelativeTime(recent)).toContain("ago")
  })
})

describe("getLocalTimezone", () => {
  it("returns a string", () => {
    const tz = getLocalTimezone()
    expect(typeof tz).toBe("string")
  })
})
