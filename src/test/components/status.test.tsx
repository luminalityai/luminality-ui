import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Status } from "@/components/status"

describe("Status", () => {
  it("renders with default variant", () => {
    render(<Status>Active</Status>)
    expect(screen.getByText("Active")).toBeInTheDocument()
  })

  it("renders each variant", () => {
    const variants = [
      "active", "online", "offline", "completed",
      "failed", "cancelled", "processing",
    ] as const

    for (const variant of variants) {
      const { unmount } = render(<Status variant={variant}>{variant}</Status>)
      expect(screen.getByText(variant)).toBeInTheDocument()
      unmount()
    }
  })
})
