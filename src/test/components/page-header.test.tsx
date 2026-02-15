import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { PageHeader } from "../../components/page-header.js"

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
})
