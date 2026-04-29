import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"
import { PageHeader } from "@/components/page-header"

describe("PageHeader (a11y)", () => {
  it("has no axe violations with title only", async () => {
    const { container } = render(<PageHeader title="Dashboard" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("has no axe violations with breadcrumbs and actions", async () => {
    const { container } = render(
      <PageHeader
        title="Profile"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Settings", href: "/settings" },
          { label: "Profile" },
        ]}
        actions={<button type="button">Save</button>}
      />,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
