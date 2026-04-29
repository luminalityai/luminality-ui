import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"
import { Time } from "@/components/time"

describe("Time (a11y)", () => {
  it("has no axe violations rendering an ISO date", async () => {
    const { container } = render(
      <Time date="2024-01-01T12:00:00Z" timezone="UTC" />,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("has no axe violations when date is null (em dash placeholder)", async () => {
    const { container } = render(<Time date={null} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
