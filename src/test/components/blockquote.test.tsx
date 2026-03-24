import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Blockquote } from "@/components/blockquote"

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

  it("no footer when no author or source", () => {
    const { container } = render(<Blockquote>Just a quote</Blockquote>)
    expect(container.querySelector("footer")).not.toBeInTheDocument()
  })

  it("author inside cite element", () => {
    const { container } = render(<Blockquote author="Shakespeare">Quote</Blockquote>)
    const cite = container.querySelector("cite")
    expect(cite).toBeInTheDocument()
    expect(cite).toHaveTextContent("Shakespeare")
  })

  it("separator between author and source", () => {
    const { container } = render(
      <Blockquote author="Shakespeare" source="Hamlet">Quote</Blockquote>
    )
    const footer = container.querySelector("footer")
    expect(footer).toHaveTextContent("Shakespeare")
    expect(footer).toHaveTextContent("Hamlet")
    expect(container.querySelector("cite")).toHaveTextContent("Shakespeare")
    expect(screen.getByText("Hamlet")).toBeInTheDocument()
  })

  it("source without cite when no author", () => {
    const { container } = render(<Blockquote source="Hamlet">Quote</Blockquote>)
    expect(container.querySelector("cite")).not.toBeInTheDocument()
    expect(screen.getByText("Hamlet")).toBeInTheDocument()
    expect(container.querySelector("footer")).toBeInTheDocument()
  })
})
