import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Blockquote } from "../../components/blockquote.js"

describe("Blockquote", () => {
  it("renders quote text", () => {
    render(<Blockquote>To be or not to be</Blockquote>)
    expect(screen.getByText("To be or not to be")).toBeInTheDocument()
  })

  it("renders with author", () => {
    render(<Blockquote author="Shakespeare">To be or not to be</Blockquote>)
    expect(screen.getByText("Shakespeare")).toBeInTheDocument()
  })

  it("renders with author and source", () => {
    render(
      <Blockquote author="Shakespeare" source="Hamlet">
        To be or not to be
      </Blockquote>
    )

    expect(screen.getByText("Shakespeare")).toBeInTheDocument()
    expect(screen.getByText("Hamlet")).toBeInTheDocument()
  })

  it("renders as blockquote element", () => {
    const { container } = render(<Blockquote>Quote</Blockquote>)
    expect(container.querySelector("blockquote")).toBeInTheDocument()
  })
})
