import { render, screen } from "@testing-library/react"
import { createRef } from "react"
import { describe, it, expect } from "vitest"
import { Button } from "../../components/button.js"

describe("Button", () => {
  it("renders with default props", () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole("button", { name: "Click me" })
    expect(button).toBeInTheDocument()
  })

  it("renders each variant", () => {
    const variants = [
      "primary", "secondary", "accent", "info", "success",
      "danger", "warning", "ghost", "muted", "outline",
    ] as const

    for (const variant of variants) {
      const { unmount } = render(<Button variant={variant}>{variant}</Button>)
      expect(screen.getByRole("button", { name: variant })).toBeInTheDocument()
      unmount()
    }
  })

  it("renders each size", () => {
    const sizes = ["sm", "md", "lg"] as const

    for (const size of sizes) {
      const { unmount } = render(<Button size={size}>{size}</Button>)
      expect(screen.getByRole("button", { name: size })).toBeInTheDocument()
      unmount()
    }
  })

  it("forwards ref", () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Ref test</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("supports asChild via Slot", () => {
    render(
      <Button asChild>
        <a href="/link">Link button</a>
      </Button>
    )
    const link = screen.getByRole("link", { name: "Link button" })
    expect(link).toBeInTheDocument()
    expect(link.tagName).toBe("A")
  })
})
