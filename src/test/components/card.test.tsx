import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/card"

describe("Card", () => {
  it("renders with children", () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText("Card content")).toBeInTheDocument()
  })

  it("renders all subcomponents", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    )

    expect(screen.getByText("Title")).toBeInTheDocument()
    expect(screen.getByText("Description")).toBeInTheDocument()
    expect(screen.getByText("Content")).toBeInTheDocument()
    expect(screen.getByText("Footer")).toBeInTheDocument()
  })

  it("applies sm padding classes", () => {
    render(
      <Card>
        <CardHeader padding="sm" data-testid="header">Header</CardHeader>
        <CardContent padding="sm" data-testid="content">Content</CardContent>
        <CardFooter padding="sm" data-testid="footer">Footer</CardFooter>
      </Card>
    )

    expect(screen.getByTestId("header").className).toContain("p-3")
    expect(screen.getByTestId("content").className).toContain("p-3")
    expect(screen.getByTestId("footer").className).toContain("p-3")
  })

  it("applies lg padding classes", () => {
    render(
      <Card>
        <CardHeader padding="lg" data-testid="header">Header</CardHeader>
        <CardContent padding="lg" data-testid="content">Content</CardContent>
        <CardFooter padding="lg" data-testid="footer">Footer</CardFooter>
      </Card>
    )

    expect(screen.getByTestId("header").className).toContain("p-6")
    expect(screen.getByTestId("content").className).toContain("p-6")
    expect(screen.getByTestId("footer").className).toContain("p-6")
  })

  it("default md padding classes applied", () => {
    render(
      <Card>
        <CardHeader data-testid="header">Header</CardHeader>
        <CardContent data-testid="content">Content</CardContent>
        <CardFooter data-testid="footer">Footer</CardFooter>
      </Card>
    )

    expect(screen.getByTestId("header").className).toContain("p-4")
    expect(screen.getByTestId("content").className).toContain("p-4")
    expect(screen.getByTestId("footer").className).toContain("p-4")
  })

  it("forwards className to Card root", () => {
    const { container } = render(<Card className="custom-card">Content</Card>)
    expect((container.firstChild as HTMLElement).className).toContain("custom-card")
  })

  it("CardTitle renders as h3", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>My Title</CardTitle>
        </CardHeader>
      </Card>
    )

    const h3 = container.querySelector("h3")
    expect(h3).toBeInTheDocument()
    expect(h3).toHaveTextContent("My Title")
  })
})
