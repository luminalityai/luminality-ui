import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"
import { Blockquote } from "@/components/blockquote"

describe("Blockquote (a11y)", () => {
  it("has no axe violations with quote text only", async () => {
    const { container } = render(<Blockquote>To be or not to be</Blockquote>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("has no axe violations with author and source", async () => {
    const { container } = render(
      <Blockquote author="Shakespeare" source="Hamlet">
        To be or not to be
      </Blockquote>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
