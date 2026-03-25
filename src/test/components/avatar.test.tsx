import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Avatar, AvatarFallback } from "@/components/avatar"

describe("Avatar", () => {
  it("renders fallback text", () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    )
    expect(screen.getByText("JD")).toBeInTheDocument()
  })

  it("renders as a span with avatar classes", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain("rounded-full")
    expect(root.className).toContain("overflow-hidden")
  })
})
