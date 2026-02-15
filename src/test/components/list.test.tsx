import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import {
  List,
  ListSection,
  ListItem,
  ListItemTitle,
  ListItemDescription,
  ListItemMeta,
} from "../../components/list.js"

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
})
