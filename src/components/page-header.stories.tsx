import type { Meta, StoryObj } from "@storybook/react-vite"
import { PageHeader } from "./page-header"
import { Button } from "./button"

const meta: Meta<typeof PageHeader> = {
  title: "Components/PageHeader",
  component: PageHeader,
}

export default meta
type Story = StoryObj<typeof PageHeader>

export const Default: Story = {
  render: () => (
    <div className="w-[800px] border border-[var(--color-border)]">
      <PageHeader title="Settings" />
    </div>
  ),
}

export const WithBreadcrumbsAndActions: Story = {
  render: () => (
    <div className="w-[800px] border border-[var(--color-border)]">
      <PageHeader
        breadcrumbs={[
          { label: "Workspace", href: "#" },
          { label: "Projects", href: "#" },
          { label: "Apollo" },
        ]}
        actions={
          <>
            <Button variant="ghost">Discard</Button>
            <Button>Save</Button>
          </>
        }
      />
    </div>
  ),
}

export const WithBackButton: Story = {
  render: () => (
    <div className="w-[800px] border border-[var(--color-border)]">
      <PageHeader title="Project details" showBackButton />
    </div>
  ),
}
