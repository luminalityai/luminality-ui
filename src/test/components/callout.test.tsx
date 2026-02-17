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

  it("no title element when title omitted", () => {
    const { container } = render(<Callout>Content only</Callout>)
    expect(container.querySelector("h4")).not.toBeInTheDocument()
  })

  it("title renders as h4", () => {
    const { container } = render(<Callout title="Important">Content</Callout>)
    const h4 = container.querySelector("h4")
    expect(h4).toBeInTheDocument()
    expect(h4).toHaveTextContent("Important")
  })

  it("forwards className", () => {
    const { container } = render(<Callout className="custom-callout">Content</Callout>)
    expect((container.firstChild as HTMLElement).className).toContain("custom-callout")
  })

  it("icons have aria-hidden=true", () => {
    const { container } = render(<Callout>Content</Callout>)
    const svg = container.querySelector("svg")
    expect(svg).toHaveAttribute("aria-hidden", "true")
  })
})
