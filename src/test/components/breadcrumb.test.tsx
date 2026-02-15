import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/breadcrumb.js"

describe("Breadcrumb", () => {
  it("renders a full navigation path", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Profile</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    expect(screen.getByRole("navigation")).toHaveAttribute("aria-label", "breadcrumb")
    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("Settings")).toBeInTheDocument()
    const currentPage = screen.getByText("Profile")
    expect(currentPage).toHaveAttribute("aria-current", "page")
    expect(currentPage).not.toHaveAttribute("role")
  })

  it("renders links with hrefs", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/home">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/home")
  })

  it("renders default separator SVG", () => {
    const { container } = render(<BreadcrumbSeparator />)
    expect(container.querySelector("svg")).toBeInTheDocument()
  })
})
