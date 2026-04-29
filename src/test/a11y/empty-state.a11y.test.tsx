import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"
import { EmptyState } from "@/components/empty-state"

function MockIcon({ className }: { className?: string }) {
  return (
    <svg data-testid="mock-icon" className={className} aria-hidden="true" />
  )
}

describe("EmptyState (a11y)", () => {
  it("has no axe violations with icon and heading", async () => {
    const { container } = render(
      <EmptyState icon={MockIcon} heading="No items" />,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("has no axe violations with description and action", async () => {
    const { container } = render(
      <EmptyState
        icon={MockIcon}
        heading="No items"
        description="Add one to get started"
        action={<button type="button">Add item</button>}
      />,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
