import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/accordion"

describe("Accordion", () => {
  it("renders items with triggers", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )

    expect(screen.getByText("Section 1")).toBeInTheDocument()
    expect(screen.getByText("Section 2")).toBeInTheDocument()
  })

  it("renders content when item is expanded", () => {
    render(
      <Accordion type="single" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Expanded content</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )

    expect(screen.getByText("Expanded content")).toBeInTheDocument()
  })

  it("expands content when trigger is clicked", async () => {
    const user = userEvent.setup()
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Hidden content</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )

    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Section 1" }))
    expect(screen.getByText("Hidden content")).toBeInTheDocument()
  })

  it("collapses content when open trigger is clicked (single collapsible)", async () => {
    const user = userEvent.setup()
    render(
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )

    expect(screen.getByText("Content 1")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Section 1" }))
    expect(screen.queryByText("Content 1")).not.toBeInTheDocument()
  })

  it("has aria-expanded=true on open trigger", () => {
    render(
      <Accordion type="single" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )

    expect(screen.getByRole("button", { name: "Section 1" })).toHaveAttribute(
      "aria-expanded",
      "true",
    )
  })

  it("has aria-expanded=false on closed trigger", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )

    expect(screen.getByRole("button", { name: "Section 1" })).toHaveAttribute(
      "aria-expanded",
      "false",
    )
  })

  it("allows multiple items open in type=multiple", async () => {
    const user = userEvent.setup()
    render(
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )

    await user.click(screen.getByRole("button", { name: "Section 1" }))
    await user.click(screen.getByRole("button", { name: "Section 2" }))
    expect(screen.getByText("Content 1")).toBeInTheDocument()
    expect(screen.getByText("Content 2")).toBeInTheDocument()
  })

  it("only one item open in type=single", async () => {
    const user = userEvent.setup()
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )

    await user.click(screen.getByRole("button", { name: "Section 1" }))
    expect(screen.getByText("Content 1")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Section 2" }))
    expect(screen.getByText("Content 2")).toBeInTheDocument()
    expect(screen.queryByText("Content 1")).not.toBeInTheDocument()
  })
})
