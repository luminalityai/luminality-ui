import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../components/dialog.js"

describe("Dialog", () => {
  it("renders trigger", () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
      </Dialog>
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
      </Dialog>
    )

    expect(screen.getByText("Dialog title")).toBeInTheDocument()
    expect(screen.getByText("Dialog description")).toBeInTheDocument()
  })
})
