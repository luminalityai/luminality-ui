import { render, screen, waitFor } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/alert-dialog"

describe("AlertDialog", () => {
  it("renders trigger", () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete</AlertDialogTrigger>
      </AlertDialog>
    )
    expect(screen.getByText("Delete")).toBeInTheDocument()
  })

  it("renders content when open", () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          <AlertDialogAction>Confirm</AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    )

    expect(screen.getByText("Are you sure?")).toBeInTheDocument()
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument()
    expect(screen.getByText("Confirm")).toBeInTheDocument()
    expect(screen.getByText("Cancel")).toBeInTheDocument()
  })

  it("AlertDialogAction defaults to danger variant", () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm</AlertDialogTitle>
          <AlertDialogDescription>Description</AlertDialogDescription>
          <AlertDialogAction data-testid="action">Delete</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    )

    const action = screen.getByTestId("action")
    expect(action.className).toContain("bg-[var(--color-danger)]")
  })

  it("AlertDialogCancel defaults to ghost variant", () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm</AlertDialogTitle>
          <AlertDialogDescription>Description</AlertDialogDescription>
          <AlertDialogCancel data-testid="cancel">Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    )

    const cancel = screen.getByTestId("cancel")
    expect(cancel.className).toContain("border-transparent")
  })

  it("opens when trigger is clicked", async () => {
    const user = userEvent.setup()
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          <AlertDialogAction>Confirm</AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    )

    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument()
    await user.click(screen.getByText("Delete"))
    expect(screen.getByText("Are you sure?")).toBeInTheDocument()
  })

  it("closes when cancel is clicked", async () => {
    const user = userEvent.setup()
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          <AlertDialogAction>Confirm</AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    )

    expect(screen.getByText("Are you sure?")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Cancel" }))
    await waitFor(() => {
      expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument()
    })
  })

  it("closes when action is clicked", async () => {
    const user = userEvent.setup()
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          <AlertDialogAction>Confirm</AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    )

    expect(screen.getByText("Are you sure?")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Confirm" }))
    await waitFor(() => {
      expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument()
    })
  })

  it("calls onOpenChange when closed via cancel", async () => {
    const user = userEvent.setup()
    const handleOpenChange = vi.fn()
    render(
      <AlertDialog defaultOpen onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          <AlertDialogAction>Confirm</AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    )

    await user.click(screen.getByRole("button", { name: "Cancel" }))
    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it("closes on Escape", async () => {
    const user = userEvent.setup()
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          <AlertDialogAction>Confirm</AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    )

    await user.keyboard("{Escape}")
    await waitFor(() => {
      expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument()
    })
  })

  it("allows overriding AlertDialogAction variant", () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm</AlertDialogTitle>
          <AlertDialogDescription>Description</AlertDialogDescription>
          <AlertDialogAction variant="primary" data-testid="action">OK</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    )

    const action = screen.getByTestId("action")
    expect(action.className).toContain("bg-[var(--color-primary)]")
    expect(action.className).not.toContain("bg-[var(--color-danger)]")
  })
})
