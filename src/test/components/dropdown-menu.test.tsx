import { render, screen, waitFor } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/dropdown-menu"

describe("DropdownMenu", () => {
  it("renders trigger", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
      </DropdownMenu>
    )
    expect(screen.getByText("Open menu")).toBeInTheDocument()
  })

  it("renders content when open", () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Action 1</DropdownMenuItem>
          <DropdownMenuItem>Action 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    expect(screen.getByText("Action 1")).toBeInTheDocument()
    expect(screen.getByText("Action 2")).toBeInTheDocument()
  })

  it("opens when trigger is clicked", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Action 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    expect(screen.queryByText("Action 1")).not.toBeInTheDocument()
    await user.click(screen.getByText("Open menu"))
    expect(screen.getByText("Action 1")).toBeInTheDocument()
  })

  it("calls onSelect when item is clicked", async () => {
    const user = userEvent.setup()
    const handleSelect = vi.fn()
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={handleSelect}>Action 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByText("Action 1"))
    expect(handleSelect).toHaveBeenCalledTimes(1)
  })

  it("closes when Escape is pressed", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Action 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    expect(screen.getByText("Action 1")).toBeInTheDocument()
    await user.keyboard("{Escape}")
    await waitFor(() => {
      expect(screen.queryByText("Action 1")).not.toBeInTheDocument()
    })
  })

  it("calls onOpenChange when toggled", async () => {
    const user = userEvent.setup()
    const handleOpenChange = vi.fn()
    render(
      <DropdownMenu onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Action 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByText("Open menu"))
    expect(handleOpenChange).toHaveBeenCalledWith(true)
  })

  it("renders DropdownMenuLabel", () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>Action 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    expect(screen.getByText("My Account")).toBeInTheDocument()
  })

  it("renders DropdownMenuSeparator", () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Action 1</DropdownMenuItem>
          <DropdownMenuSeparator data-testid="separator" />
          <DropdownMenuItem>Action 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    expect(screen.getByTestId("separator")).toBeInTheDocument()
  })
})
