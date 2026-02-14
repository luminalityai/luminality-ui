import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "../../components/alert-dialog.js"

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
})
