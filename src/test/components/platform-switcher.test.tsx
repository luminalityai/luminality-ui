import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { PlatformSwitcher } from "@/components/platform-switcher"

describe("PlatformSwitcher", () => {
  it("renders static (non-interactive) icon", () => {
    render(
      <PlatformSwitcher
        icon={<span data-testid="icon">S</span>}
        label="Test App"
        interactive={false}
      />,
    )
    expect(screen.getByTestId("icon")).toBeInTheDocument()
    expect(screen.getByLabelText("Test App")).toBeInTheDocument()
  })

  it("renders interactive trigger with chevron", () => {
    render(
      <PlatformSwitcher
        icon={<span data-testid="icon">S</span>}
        label="Test App"
        linkedApps={[
          {
            name: "Other App",
            icon: <span>O</span>,
            href: "https://example.com",
          },
        ]}
      />,
    )
    const button = screen.getByLabelText("Test App")
    expect(button.tagName).toBe("BUTTON")
  })

  it("falls back to static when interactive but no items", () => {
    render(
      <PlatformSwitcher
        icon={<span data-testid="icon">S</span>}
        label="Test App"
        interactive={true}
      />,
    )
    expect(screen.getByLabelText("Test App")).toBeInTheDocument()
  })

  it("shows linked apps in dropdown", async () => {
    const user = userEvent.setup()
    render(
      <PlatformSwitcher
        icon={<span>S</span>}
        label="Test App"
        linkedApps={[
          {
            name: "App One",
            icon: <span>1</span>,
            href: "https://one.example.com",
          },
          {
            name: "App Two",
            icon: <span>2</span>,
            href: "https://two.example.com",
          },
        ]}
      />,
    )
    await user.click(screen.getByLabelText("Test App"))
    expect(screen.getByText("App One")).toBeInTheDocument()
    expect(screen.getByText("App Two")).toBeInTheDocument()
  })

  it("shows organisations with active indicator", async () => {
    const user = userEvent.setup()
    render(
      <PlatformSwitcher
        icon={<span>S</span>}
        label="Test App"
        organisations={[
          { id: "1", name: "Acme Corp" },
          { id: "2", name: "Beta Inc" },
        ]}
        activeOrganisationId="1"
      />,
    )
    await user.click(screen.getByLabelText("Test App"))
    expect(screen.getByText("Acme Corp")).toBeInTheDocument()
    expect(screen.getByText("Beta Inc")).toBeInTheDocument()
    expect(screen.getByText("A")).toBeInTheDocument()
  })

  it("calls onSwitchOrganisation when org is selected", async () => {
    const onSwitch = vi.fn()
    const user = userEvent.setup()
    render(
      <PlatformSwitcher
        icon={<span>S</span>}
        label="Test App"
        organisations={[{ id: "1", name: "Acme Corp" }]}
        onSwitchOrganisation={onSwitch}
      />,
    )
    await user.click(screen.getByLabelText("Test App"))
    await user.click(screen.getByText("Acme Corp"))
    expect(onSwitch).toHaveBeenCalledWith("1")
  })
})
