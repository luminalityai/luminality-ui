import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import {
  List,
  ListSection,
  ListItem,
  ListItemTitle,
  ListItemDescription,
  ListItemMeta,
} from "@/components/list"

describe("List", () => {
  it("renders items", () => {
    render(
      <List>
        <ListItem>
          <ListItemTitle>Item one</ListItemTitle>
        </ListItem>
        <ListItem>
          <ListItemTitle>Item two</ListItemTitle>
        </ListItem>
      </List>
    )

    expect(screen.getByText("Item one")).toBeInTheDocument()
    expect(screen.getByText("Item two")).toBeInTheDocument()
  })

  it("renders section with title", () => {
    render(
      <List>
        <ListSection title="Section A">
          <ListItem>
            <ListItemTitle>Child</ListItemTitle>
          </ListItem>
        </ListSection>
      </List>
    )

    expect(screen.getByText("Section A")).toBeInTheDocument()
    expect(screen.getByText("Child")).toBeInTheDocument()
  })

  it("renders description and meta", () => {
    render(
      <List>
        <ListItem>
          <ListItemTitle>Title</ListItemTitle>
          <ListItemDescription>Description text</ListItemDescription>
          <ListItemMeta>Meta info</ListItemMeta>
        </ListItem>
      </List>
    )

    expect(screen.getByText("Description text")).toBeInTheDocument()
    expect(screen.getByText("Meta info")).toBeInTheDocument()
  })

  it("collapsible section is expanded by default", () => {
    render(
      <List>
        <ListSection title="Collapsible" collapsible>
          <ListItem><ListItemTitle>Child</ListItemTitle></ListItem>
        </ListSection>
      </List>
    )

    expect(screen.getByRole("button", { name: "Collapsible" })).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Child")).toBeInTheDocument()
  })

  it("collapses when title button is clicked", async () => {
    const user = userEvent.setup()
    render(
      <List>
        <ListSection title="Collapsible" collapsible>
          <ListItem><ListItemTitle>Child</ListItemTitle></ListItem>
        </ListSection>
      </List>
    )

    await user.click(screen.getByRole("button", { name: "Collapsible" }))
    expect(screen.getByRole("button", { name: "Collapsible" })).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByText("Child")).not.toBeInTheDocument()
  })

  it("expands collapsed section when title button is clicked", async () => {
    const user = userEvent.setup()
    render(
      <List>
        <ListSection title="Collapsible" collapsible defaultOpen={false}>
          <ListItem><ListItemTitle>Child</ListItemTitle></ListItem>
        </ListSection>
      </List>
    )

    expect(screen.queryByText("Child")).not.toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Collapsible" }))
    expect(screen.getByText("Child")).toBeInTheDocument()
  })

  it("renders action buttons on ListItem", () => {
    render(
      <List>
        <ListItem actions={[{ icon: <span>icon</span>, label: "Edit", onClick: vi.fn() }]}>
          <ListItemTitle>Item</ListItemTitle>
        </ListItem>
      </List>
    )

    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument()
  })

  it("fires onClick on action button", async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <List>
        <ListItem actions={[{ icon: <span>icon</span>, label: "Delete", onClick: handleClick }]}>
          <ListItemTitle>Item</ListItemTitle>
        </ListItem>
      </List>
    )

    await user.click(screen.getByRole("button", { name: "Delete" }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("renders prefix element", () => {
    render(
      <List>
        <ListItem prefix="AB">
          <ListItemTitle>Item</ListItemTitle>
        </ListItem>
      </List>
    )

    expect(screen.getByText("AB")).toBeInTheDocument()
  })

  it("applies active styling", () => {
    render(
      <List>
        <ListItem active data-testid="active-item">
          <ListItemTitle>Item</ListItemTitle>
        </ListItem>
      </List>
    )

    expect(screen.getByTestId("active-item").className).toContain("bg-[var(--color-surface-hover)]")
  })
})
