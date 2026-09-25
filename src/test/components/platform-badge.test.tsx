import * as React from "react"
import { cleanup, render, screen } from "@testing-library/react"
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

  it("keeps label as the accessible name (aria-label / aria-labelledby are not props)", () => {
    render(
      <>
        <span id="other">Other name</span>
        {/* @ts-expect-error aria-label is not a PlatformBadge prop */}
        <PlatformBadge
          icon={<span>S</span>}
          label="Luminality"
          aria-label="Overridden"
        />
      </>,
    )
    expect(screen.getByRole("img", { name: "Luminality" })).toBeInTheDocument()
    expect(screen.queryByRole("img", { name: "Overridden" })).toBeNull()

    cleanup()
    render(
      <>
        <span id="other">Other name</span>
        {/* @ts-expect-error aria-labelledby is not a PlatformBadge prop */}
        <PlatformBadge
          icon={<span>S</span>}
          label="Luminality"
          aria-labelledby="other"
        />
      </>,
    )
    const tile = screen.getByRole("img", { name: "Luminality" })
    expect(tile).not.toHaveAttribute("aria-labelledby")
  })
})
