import { describe, it, expect } from "vitest"
import { render, within } from "@testing-library/react"
import { EmptyState } from "@/components/empty-state"

function MockIcon({ className }: { className?: string }) {
  return <svg data-testid="mock-icon" className={className} />
}

describe("EmptyState", () => {
  it("renders icon and heading", () => {
    const { container } = render(
      <EmptyState icon={MockIcon} heading="No items" />,
    )
    expect(within(container).getByText("No items")).toBeInTheDocument()
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("renders description when provided", () => {
    const { container } = render(
      <EmptyState
        icon={MockIcon}
        heading="No items"
        description="Try adding one"
      />,
    )
    const view = within(container)
    expect(view.getByText("No items")).toBeInTheDocument()
    expect(view.getByText("Try adding one")).toBeInTheDocument()
  })

  it("omits description when not provided", () => {
    const { container } = render(
      <EmptyState icon={MockIcon} heading="No items" />,
    )
    expect(container.querySelectorAll("p")).toHaveLength(0)
  })

  it("renders action when provided", () => {
    const { container } = render(
      <EmptyState
        icon={MockIcon}
        heading="No items"
        action={<button>Add item</button>}
      />,
    )
    expect(within(container).getByText("Add item")).toBeInTheDocument()
  })

  it("merges custom className", () => {
    const { container } = render(
      <EmptyState
        icon={MockIcon}
        heading="No items"
        className="custom-class"
      />,
    )
    expect(container.firstChild).toHaveClass("custom-class")
  })
})
