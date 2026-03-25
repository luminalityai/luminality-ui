import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Badge } from "@/components/badge"

describe("Badge", () => {
  it("renders with default props", () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText("New")).toBeInTheDocument()
  })

  it("renders each variant", () => {
    const variants = [
      "primary",
      "secondary",
      "accent",
      "info",
      "success",
      "warning",
      "danger",
      "muted",
    ] as const

    for (const variant of variants) {
      const { unmount } = render(<Badge variant={variant}>{variant}</Badge>)
      expect(screen.getByText(variant)).toBeInTheDocument()
      unmount()
    }
  })

  it("renders each size", () => {
    const sizes = ["sm", "md"] as const

    for (const size of sizes) {
      const { unmount } = render(<Badge size={size}>{size}</Badge>)
      expect(screen.getByText(size)).toBeInTheDocument()
      unmount()
    }
  })
})
