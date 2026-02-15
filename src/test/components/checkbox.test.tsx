import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Checkbox } from "../../components/checkbox.js"

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
})
