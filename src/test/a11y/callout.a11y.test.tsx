import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"
import { Callout } from "@/components/callout"

describe("Callout (a11y)", () => {
  it("has no axe violations with default note variant", async () => {
    const { container } = render(<Callout>Some note</Callout>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("has no axe violations with title and warning variant", async () => {
    const { container } = render(
      <Callout variant="warning" title="Heads up">
        Be careful
      </Callout>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("has no axe violations with success variant", async () => {
    const { container } = render(
      <Callout variant="success" title="All good">
        Operation completed successfully.
      </Callout>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
