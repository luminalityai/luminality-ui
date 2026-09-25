import * as React from "react"
import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import { PlatformBadge } from "@/components/platform-badge"

describe("PlatformBadge", () => {
  it("renders the icon inside an img-role tile named by label", () => {
    render(
      <PlatformBadge
        icon={<span data-testid="icon">S</span>}
        label="Luminality"
      />,
    )
    const tile = screen.getByRole("img", { name: "Luminality" })
    expect(tile).toContainElement(screen.getByTestId("icon"))
  })

  it("does not render a button or any focusable control", async () => {
    const user = userEvent.setup()
    render(
      <>
        <PlatformBadge icon={<span>S</span>} label="Luminality" />
        <button type="button">after</button>
      </>,
    )
    expect(screen.queryByRole("button", { name: "Luminality" })).toBeNull()
    const tile = screen.getByRole("img", { name: "Luminality" })
    expect(tile).not.toHaveAttribute("tabindex")

    // Tabbing from the start of the document skips the tile entirely.
    await user.tab()
    expect(screen.getByRole("button", { name: "after" })).toHaveFocus()
  })

  it("appends className and forwards the ref and extra attributes", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <PlatformBadge
        ref={ref}
        icon={<span>S</span>}
        label="Luminality"
        className="mt-2"
        style={{ "--color-primary": "#000" } as React.CSSProperties}
        data-testid="badge"
      />,
    )
    const tile = screen.getByTestId("badge")
    expect(ref.current).toBe(tile)
    expect(tile).toHaveClass("mt-2", "h-10", "bg-[var(--color-primary)]")
    expect(tile.style.getPropertyValue("--color-primary")).toBe("#000")
  })
})
