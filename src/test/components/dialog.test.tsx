import { render, screen, waitFor } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/dialog"

describe("Dialog", () => {
  it("renders trigger", () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
      </Dialog>,
    )
    expect(screen.getByText("Open")).toBeInTheDocument()
  })

  it("renders content when open", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Dialog title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogContent>
      </Dialog>,
    )

    expect(screen.getByText("Dialog title")).toBeInTheDocument()
    expect(screen.getByText("Dialog description")).toBeInTheDocument()
  })

  it("opens when trigger is clicked", async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Desc</DialogDescription>
        </DialogContent>
      </Dialog>,
    )

    expect(screen.queryByText("Title")).not.toBeInTheDocument()
    await user.click(screen.getByText("Open"))
    expect(screen.getByText("Title")).toBeInTheDocument()
  })

  it("closes when Escape is pressed", async () => {
    const user = userEvent.setup()
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Desc</DialogDescription>
        </DialogContent>
      </Dialog>,
    )

    expect(screen.getByText("Title")).toBeInTheDocument()
    await user.keyboard("{Escape}")
    await waitFor(() => {
      expect(screen.queryByText("Title")).not.toBeInTheDocument()
    })
  })

  it("calls onOpenChange when opened", async () => {
    const user = userEvent.setup()
    const handleOpenChange = vi.fn()
    render(
      <Dialog onOpenChange={handleOpenChange}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Desc</DialogDescription>
        </DialogContent>
      </Dialog>,
    )

    await user.click(screen.getByText("Open"))
    expect(handleOpenChange).toHaveBeenCalledWith(true)
  })

  it("calls onOpenChange when closed via Escape", async () => {
    const user = userEvent.setup()
    const handleOpenChange = vi.fn()
    render(
      <Dialog defaultOpen onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Desc</DialogDescription>
        </DialogContent>
      </Dialog>,
    )

    await user.keyboard("{Escape}")
    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it("renders DialogHeader and DialogFooter", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Desc</DialogDescription>
          <DialogHeader data-testid="header">Header content</DialogHeader>
          <DialogFooter data-testid="footer">Footer content</DialogFooter>
        </DialogContent>
      </Dialog>,
    )

    expect(screen.getByTestId("header")).toHaveTextContent("Header content")
    expect(screen.getByTestId("footer")).toHaveTextContent("Footer content")
  })
})
