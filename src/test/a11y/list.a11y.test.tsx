import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"
import {
  List,
  ListSection,
  ListItem,
  ListItemTitle,
  ListItemDescription,
  ListItemMeta,
} from "@/components/list"

describe("List (a11y)", () => {
  it("has no axe violations with basic items", async () => {
    const { container } = render(
      <List>
        <ListItem>
          <ListItemTitle>Item one</ListItemTitle>
        </ListItem>
        <ListItem>
          <ListItemTitle>Item two</ListItemTitle>
          <ListItemDescription>With description</ListItemDescription>
        </ListItem>
      </List>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("has no axe violations with sections and meta", async () => {
    const { container } = render(
      <List>
        <ListSection title="Section A">
          <ListItem>
            <ListItemTitle>Child</ListItemTitle>
            <ListItemMeta>Meta info</ListItemMeta>
          </ListItem>
        </ListSection>
      </List>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
