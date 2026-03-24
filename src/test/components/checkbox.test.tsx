import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { Checkbox } from "@/components/checkbox"

describe("Checkbox", () => {
  it("renders unchecked by default", () => {
    render(<Checkbox aria-label="Accept terms" />)
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" })
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
  })

  it("renders checked state", () => {
    render(<Checkbox aria-label="Accept terms" checked />)
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" })
    expect(checkbox).toBeChecked()
  })

  it("toggles checked state when clicked", async () => {
    const user = userEvent.setup()
    render(<Checkbox aria-label="Accept terms" />)
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" })
    expect(checkbox).not.toBeChecked()
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it("calls onCheckedChange when toggled", async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Checkbox aria-label="Accept terms" onCheckedChange={handleChange} />)
    await user.click(screen.getByRole("checkbox", { name: "Accept terms" }))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Checkbox aria-label="Accept terms" disabled onCheckedChange={handleChange} />)
    await user.click(screen.getByRole("checkbox", { name: "Accept terms" }))
    expect(handleChange).not.toHaveBeenCalled()
  })

  it("has aria-checked true when checked", () => {
    render(<Checkbox aria-label="Accept terms" checked />)
    expect(screen.getByRole("checkbox", { name: "Accept terms" })).toHaveAttribute("aria-checked", "true")
  })

  it("has aria-checked false when unchecked", () => {
    render(<Checkbox aria-label="Accept terms" />)
    expect(screen.getByRole("checkbox", { name: "Accept terms" })).toHaveAttribute("aria-checked", "false")
  })

  it("forwards className", () => {
    render(<Checkbox aria-label="Accept terms" className="custom-class" />)
    expect(screen.getByRole("checkbox", { name: "Accept terms" }).className).toContain("custom-class")
  })
})
