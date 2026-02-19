import { useState } from "react"
import {
  List, ListSection, ListItem, ListItemTitle, ListItemDescription, ListItemMeta,
} from "@lib/components/list"
import { Badge } from "@lib/components/badge"
import { Section } from "../../components/section"
import { ToggleControl } from "../../components/prop-control"

export function ListPage() {
  const [collapsible, setCollapsible] = useState(false)
  const [showActions, setShowActions] = useState(true)

  return (
    <>
      <h1 className="text-2xl font-bold text-[var(--color-text)]">List</h1>
      <p className="text-[var(--color-text-muted)]">Structured list with sections, icons, and actions.</p>

      <Section title="Interactive Preview">
        <div className="grid grid-cols-[240px_1fr] gap-8">
          <div className="space-y-3">
            <ToggleControl label="Collapsible sections" checked={collapsible} onChange={setCollapsible} />
            <ToggleControl label="Show actions" checked={showActions} onChange={setShowActions} />
          </div>
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-8">
            <List>
              <ListSection title="Team Members" collapsible={collapsible}>
                <ListItem
                  prefix="JD"
                  actions={showActions ? [{ icon: <EditIcon />, label: "Edit", onClick: () => {} }] : []}
                >
                  <div className="flex-1 min-w-0">
                    <ListItemTitle>Jane Doe</ListItemTitle>
                    <ListItemDescription>Engineering Lead</ListItemDescription>
                  </div>
                  <ListItemMeta>
                    <Badge variant="success" size="sm">Active</Badge>
                  </ListItemMeta>
                </ListItem>
                <ListItem
                  prefix="AB"
                  actions={showActions ? [{ icon: <EditIcon />, label: "Edit", onClick: () => {} }] : []}
                >
                  <div className="flex-1 min-w-0">
                    <ListItemTitle>Alice Brown</ListItemTitle>
                    <ListItemDescription>Designer</ListItemDescription>
                  </div>
                  <ListItemMeta>
                    <Badge variant="info" size="sm">Away</Badge>
                  </ListItemMeta>
                </ListItem>
              </ListSection>
            </List>
          </div>
        </div>
      </Section>

      <Section title="With Active State">
        <List>
          <ListItem prefix="A" active>
            <div className="flex-1 min-w-0">
              <ListItemTitle>Active Item</ListItemTitle>
              <ListItemDescription>This item has the active state</ListItemDescription>
            </div>
          </ListItem>
          <ListItem prefix="B">
            <div className="flex-1 min-w-0">
              <ListItemTitle>Normal Item</ListItemTitle>
              <ListItemDescription>This item is in its default state</ListItemDescription>
            </div>
          </ListItem>
        </List>
      </Section>

      <Section title="Usage">
        <pre className="p-4 rounded-[var(--radius-md)] bg-[var(--color-muted)] text-sm overflow-x-auto">
{`import {
  List, ListSection, ListItem, ListItemTitle, ListItemDescription,
} from "@rarebit-one/luminality-ui"

<List>
  <ListSection title="Section">
    <ListItem prefix="JD">
      <ListItemTitle>Name</ListItemTitle>
      <ListItemDescription>Role</ListItemDescription>
    </ListItem>
  </ListSection>
</List>`}
        </pre>
      </Section>
    </>
  )
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  )
}
