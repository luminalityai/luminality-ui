import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, userEvent, within } from "storybook/test"
import { Button } from "./button"

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "accent",
        "info",
        "success",
        "danger",
        "warning",
        "ghost",
        "muted",
        "outline",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "auto"],
    },
    disabled: { control: "boolean" },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    children: "Button",
    variant: "primary",
  },
}

export const Clickable: Story = {
  args: {
    children: "Click me",
    variant: "primary",
    onClick: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole("button", { name: "Click me" })
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  },
}

export const DisabledDoesNotClick: Story = {
  args: {
    children: "Disabled",
    disabled: true,
    onClick: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole("button", { name: "Disabled" })
    await expect(button).toBeDisabled()
    // A disabled button sets `pointer-events: none`; userEvent refuses to click
    // it (which is the correct browser behavior), so assert the handler stays
    // uncalled rather than forcing a click through.
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="info">Info</Button>
      <Button variant="success">Success</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="muted">Muted</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
}

// A gate only audits the pairs its stories construct. Every story above paints
// on `--color-background`, which is precisely the surface the dark-theme defect
// in #181 PASSED on: the ink measured 5.28:1 on the canvas but 4.48:1 on
// `--color-surface` and 3.75:1 on `--color-surface-hover` — the two surfaces
// these variants actually ship on inside Card and panel chrome. The token fix
// landed with the gate structurally unable to see the thing it fixed, and the
// before/after numbers had to come from a hand-run browser probe.
//
// This renders the ink-on-surface variants on both real surfaces so axe measures
// the failing pairs on all four {viewport} x {theme} instances. The fill-backed
// variants (primary, danger, …) are deliberately absent: they carry their own
// `-foreground` ink, so the page surface behind them is not the pair under test.
// luminalityai/delivery-ops#309.
const SURFACES = [
  ["--color-surface", "on --color-surface"],
  ["--color-surface-hover", "on --color-surface-hover"],
] as const

export const OnSurfaces: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {SURFACES.map(([token, label]) => (
        <div
          key={token}
          className="flex flex-wrap items-center gap-3 rounded-lg p-4"
          style={{ background: `var(${token})` }}
        >
          <span className="text-sm text-[var(--color-text)]">{label}</span>
          <Button variant="outline">Outline</Button>
          <Button variant="link">Link</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="muted">Muted</Button>
        </div>
      ))}
    </div>
  ),
}
