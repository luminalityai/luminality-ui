import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
}

export default meta
type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[480px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="text-sm text-[var(--color-text-secondary)]">
          High-level summary of the project.
        </p>
      </TabsContent>
      <TabsContent value="activity">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Recent activity from collaborators.
        </p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Project-level settings and preferences.
        </p>
      </TabsContent>
    </Tabs>
  ),
}

export const SwitchesTabs: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[480px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="text-sm text-[var(--color-text-secondary)]">
          High-level summary of the project.
        </p>
      </TabsContent>
      <TabsContent value="activity">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Recent activity from collaborators.
        </p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Project-level settings and preferences.
        </p>
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Overview is selected by default.
    await expect(
      canvas.getByText("High-level summary of the project."),
    ).toBeVisible()
    await expect(canvas.getByRole("tab", { name: "Overview" })).toHaveAttribute(
      "aria-selected",
      "true",
    )

    // Activate the Settings tab.
    await userEvent.click(canvas.getByRole("tab", { name: "Settings" }))
    await expect(
      canvas.getByText("Project-level settings and preferences."),
    ).toBeVisible()
    await expect(canvas.getByRole("tab", { name: "Settings" })).toHaveAttribute(
      "aria-selected",
      "true",
    )
  },
}

// Same structural gap as Button's `OnSurfaces` — see that story for the full
// argument. The active `TabsTrigger` carries its ink directly on whatever
// surface the tab strip sits on, and in the consuming apps that is a Card, not
// the page canvas. Storying it only on `--color-background` means the gate
// measures the one pair the #297 defect passed on.
// luminalityai/delivery-ops#309.
const TAB_SURFACES = [
  ["--color-surface", "on --color-surface"],
  ["--color-surface-hover", "on --color-surface-hover"],
] as const

export const OnSurfaces: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {TAB_SURFACES.map(([token, label]) => (
        <div
          key={token}
          className="rounded-lg p-4"
          style={{ background: `var(${token})` }}
        >
          <p className="mb-2 text-sm text-[var(--color-text)]">{label}</p>
          <Tabs defaultValue="overview" className="w-[480px]">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <p className="text-sm text-[var(--color-text-secondary)]">
                High-level summary of the project.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      ))}
    </div>
  ),
}
