import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"
import { PlatformBadge } from "@/components/platform-badge"

describe("PlatformBadge (a11y)", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <PlatformBadge icon={<span>S</span>} label="Luminality" />,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
