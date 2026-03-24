import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { PageHeader } from "@/components/page-header"

describe("PageHeader", () => {
  it("renders title", () => {
    render(<PageHeader title="Dashboard" />)
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
  })

  it("renders breadcrumbs", () => {
    render(
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Settings", href: "/settings" },
          { label: "Profile" },
        ]}
      />
    )

    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("Settings")).toBeInTheDocument()
    expect(screen.getByText("Profile")).toBeInTheDocument()
  })

  it("renders actions slot", () => {
    render(
      <PageHeader title="Page" actions={<button>Save</button>} />
    )

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
  })

  it("renders children", () => {
    render(
      <PageHeader>
        <span>Custom content</span>
      </PageHeader>
    )

    expect(screen.getByText("Custom content")).toBeInTheDocument()
  })

  it("renders back button with aria-label Go back", () => {
    render(<PageHeader title="Page" showBackButton />)
    expect(screen.getByRole("button", { name: "Go back" })).toBeInTheDocument()
  })

  it("calls onBackClick when back button is clicked", async () => {
    const user = userEvent.setup()
    const handleBack = vi.fn()
    render(<PageHeader title="Page" showBackButton onBackClick={handleBack} />)
    await user.click(screen.getByRole("button", { name: "Go back" }))
    expect(handleBack).toHaveBeenCalledTimes(1)
  })

  it("does not render back button when showBackButton is false", () => {
    render(<PageHeader title="Page" />)
    expect(screen.queryByRole("button", { name: "Go back" })).not.toBeInTheDocument()
  })

  it("last breadcrumb has aria-current=page", () => {
    render(
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Current" },
        ]}
      />
    )

    expect(screen.getByText("Current")).toHaveAttribute("aria-current", "page")
    expect(screen.getByText("Home")).not.toHaveAttribute("aria-current")
  })

  it("title only renders when breadcrumbs are not provided", () => {
    const { rerender } = render(<PageHeader title="My Title" />)
    expect(screen.getByText("My Title")).toBeInTheDocument()

    rerender(
      <PageHeader
        title="My Title"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Page" }]}
      />
    )
    expect(screen.queryByText("My Title")).not.toBeInTheDocument()
  })
})
