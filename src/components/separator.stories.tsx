import type { Meta, StoryObj } from "@storybook/react-vite"
import { Separator } from "./separator"

const meta: Meta<typeof Separator> = {
  title: "Components/Separator",
  component: Separator,
}

export default meta
type Story = StoryObj<typeof Separator>

export const Default: Story = {
  render: () => (
    <div className="w-[400px] text-sm text-[var(--color-text)]">
      <div>Above</div>
      <Separator className="my-3" />
      <div>Below</div>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-12 items-center gap-3 text-sm text-[var(--color-text)]">
      <span>Left</span>
      <Separator orientation="vertical" />
      <span>Middle</span>
      <Separator orientation="vertical" />
      <span>Right</span>
    </div>
  ),
}

export const Dashed: Story = {
  render: () => (
    <div className="w-[400px] text-sm text-[var(--color-text)]">
      <div>Above</div>
      <Separator dashed className="my-3" />
      <div>Below</div>
    </div>
  ),
}
