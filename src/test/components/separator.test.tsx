import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Separator } from "../../components/separator.js"

describe("Separator", () => {
  it("renders horizontal separator by default", () => {
    const { container } = render(<Separator />)
    const separator = container.firstChild as HTMLElement
    expect(separator).toHaveAttribute("data-orientation", "horizontal")
  })

  it("renders vertical separator", () => {
    const { container } = render(<Separator orientation="vertical" />)
    const separator = container.firstChild as HTMLElement
    expect(separator).toHaveAttribute("data-orientation", "vertical")
  })

  it("supports dashed prop", () => {
    const { container } = render(<Separator dashed />)
    const separator = container.firstChild as HTMLElement
    expect(separator.className).toContain("border-dashed")
  })

  it("has role=separator when not decorative", () => {
    const { container } = render(<Separator decorative={false} />)
    const separator = container.firstChild as HTMLElement
    expect(separator).toHaveAttribute("role", "separator")
  })

  it("has no separator role when decorative (default)", () => {
    const { container } = render(<Separator />)
    const separator = container.firstChild as HTMLElement
    expect(separator).toHaveAttribute("role", "none")
  })

  it("has correct data-orientation attribute", () => {
    const { container: h } = render(<Separator orientation="horizontal" />)
    expect(h.firstChild).toHaveAttribute("data-orientation", "horizontal")

    const { container: v } = render(<Separator orientation="vertical" />)
    expect(v.firstChild).toHaveAttribute("data-orientation", "vertical")
  })
})
