import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Callout } from "../../components/callout.js"

describe("Callout", () => {
  it("renders with default note variant", () => {
    const { container } = render(<Callout>Some note</Callout>)
    expect(screen.getByText("Some note")).toBeInTheDocument()
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("renders with title", () => {
    render(<Callout title="Heads up">Content here</Callout>)
    expect(screen.getByText("Heads up")).toBeInTheDocument()
    expect(screen.getByText("Content here")).toBeInTheDocument()
  })

  it("renders each variant", () => {
    const variants = ["info", "warning", "success", "danger", "note"] as const

    for (const variant of variants) {
      const { container, unmount } = render(
        <Callout variant={variant} title={variant}>
          {variant} content
        </Callout>
      )
      expect(screen.getByText(variant)).toBeInTheDocument()
      expect(container.querySelector("svg")).toBeInTheDocument()
      unmount()
    }
  })
})
