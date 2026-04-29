import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"
import { Separator } from "@/components/separator"

describe("Separator (a11y)", () => {
  it("has no axe violations as a decorative separator", async () => {
    const { container } = render(
      <div>
        <p>Above</p>
        <Separator />
        <p>Below</p>
      </div>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("has no axe violations as a semantic (non-decorative) separator", async () => {
    const { container } = render(
      <div>
        <p>Above</p>
        <Separator decorative={false} />
        <p>Below</p>
      </div>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
