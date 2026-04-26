import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  List,
  ListItem,
  ListItemDescription,
  ListItemMeta,
  ListItemTitle,
  ListSection,
} from "./list"

const meta: Meta<typeof List> = {
  title: "Components/List",
  component: List,
}

export default meta
type Story = StoryObj<typeof List>

export const Default: Story = {
  render: () => (
    <List className="w-[480px]">
      <ListItem>
        <div className="flex-1 min-w-0">
          <ListItemTitle>Project Apollo</ListItemTitle>
          <ListItemDescription>Last updated 2 hours ago</ListItemDescription>
        </div>
      </ListItem>
      <ListItem>
        <div className="flex-1 min-w-0">
          <ListItemTitle>Project Gemini</ListItemTitle>
          <ListItemDescription>Last updated yesterday</ListItemDescription>
        </div>
      </ListItem>
      <ListItem active>
        <div className="flex-1 min-w-0">
          <ListItemTitle>Project Mercury</ListItemTitle>
          <ListItemDescription>Last updated 3 days ago</ListItemDescription>
        </div>
      </ListItem>
    </List>
  ),
}

export const WithSections: Story = {
  render: () => (
    <List className="w-[480px]">
      <ListSection title="Recent">
        <ListItem prefix="A">
          <div className="flex-1 min-w-0">
            <ListItemTitle>Apollo</ListItemTitle>
            <ListItemMeta>3 collaborators</ListItemMeta>
          </div>
        </ListItem>
        <ListItem prefix="G">
          <div className="flex-1 min-w-0">
            <ListItemTitle>Gemini</ListItemTitle>
            <ListItemMeta>1 collaborator</ListItemMeta>
          </div>
        </ListItem>
      </ListSection>
      <ListSection title="Archived">
        <ListItem prefix="M">
          <div className="flex-1 min-w-0">
            <ListItemTitle>Mercury</ListItemTitle>
            <ListItemMeta>Archived 2026-01-15</ListItemMeta>
          </div>
        </ListItem>
      </ListSection>
    </List>
  ),
}
