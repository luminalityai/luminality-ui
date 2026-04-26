import type { Meta, StoryObj } from "@storybook/react-vite"
import { Checkbox } from "./checkbox"

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  render: () => (
    <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
      <Checkbox />
      Accept terms and conditions
    </label>
  ),
}

export const Checked: Story = {
  render: () => (
    <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
      <Checkbox defaultChecked />
      Subscribe to newsletter
    </label>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-2 text-sm text-[var(--color-text)]">
      <label className="flex items-center gap-2">
        <Checkbox disabled />
        Disabled unchecked
      </label>
      <label className="flex items-center gap-2">
        <Checkbox disabled defaultChecked />
        Disabled checked
      </label>
    </div>
  ),
}
