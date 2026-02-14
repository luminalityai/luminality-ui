import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../components/card.js"

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
})
