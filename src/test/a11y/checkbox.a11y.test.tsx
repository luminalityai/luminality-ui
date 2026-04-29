import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"
import { Checkbox } from "@/components/checkbox"

describe("Checkbox (a11y)", () => {
  it("has no axe violations with aria-label", async () => {
    const { container } = render(<Checkbox aria-label="Accept terms" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("has no axe violations when checked and disabled", async () => {
    const { container } = render(
      <Checkbox aria-label="Accept terms" checked disabled />,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("has no axe violations when paired with a visible label", async () => {
    const { container } = render(
      <label>
        <Checkbox /> Subscribe to newsletter
      </label>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
