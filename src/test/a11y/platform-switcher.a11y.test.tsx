import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"
import { PlatformSwitcher } from "@/components/platform-switcher"

describe("PlatformSwitcher (a11y)", () => {
  it("has no axe violations as a static (non-interactive) icon", async () => {
    const { container } = render(
      <PlatformSwitcher
        icon={<span>S</span>}
        label="Sidekick"
        interactive={false}
      />,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("has no axe violations as an interactive trigger (closed)", async () => {
    const { container } = render(
      <PlatformSwitcher
        icon={<span>S</span>}
        label="Sidekick"
        linkedApps={[
          {
            name: "Other App",
            icon: <span>O</span>,
            href: "https://example.com",
          },
        ]}
      />,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
