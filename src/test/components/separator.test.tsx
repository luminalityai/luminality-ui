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
})
