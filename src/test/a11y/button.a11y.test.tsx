import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"
import { Button } from "@/components/button"

describe("Button (a11y)", () => {
  it("has no axe violations with default props", async () => {
    const { container } = render(<Button>Click me</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("has no axe violations when disabled", async () => {
    const { container } = render(<Button disabled>Disabled</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("has no axe violations with danger variant", async () => {
    const { container } = render(<Button variant="danger">Delete</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("has no axe violations with ghost variant", async () => {
    const { container } = render(<Button variant="ghost">Cancel</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("has no axe violations with link variant", async () => {
    const { container } = render(<Button variant="link">Learn more</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
