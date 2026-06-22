import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"
import { Checkbox } from "./checkbox"

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-sm text-[var(--color-text)]">
      <Checkbox id="checkbox-default" />
      <label htmlFor="checkbox-default">Accept terms and conditions</label>
    </div>
  ),
}

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-sm text-[var(--color-text)]">
      <Checkbox id="checkbox-checked" defaultChecked />
      <label htmlFor="checkbox-checked">Subscribe to newsletter</label>
    </div>
  ),
}

export const Toggles: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-sm text-[var(--color-text)]">
      <Checkbox id="checkbox-toggle" />
      <label htmlFor="checkbox-toggle">Accept terms and conditions</label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole("checkbox", {
      name: "Accept terms and conditions",
    })
    await expect(checkbox).not.toBeChecked()
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
    await userEvent.click(checkbox)
    await expect(checkbox).not.toBeChecked()
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-2 text-sm text-[var(--color-text)]">
      <div className="flex items-center gap-2">
        <Checkbox id="checkbox-disabled-unchecked" disabled />
        <label htmlFor="checkbox-disabled-unchecked">Disabled unchecked</label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="checkbox-disabled-checked" disabled defaultChecked />
        <label htmlFor="checkbox-disabled-checked">Disabled checked</label>
      </div>
    </div>
  ),
}
