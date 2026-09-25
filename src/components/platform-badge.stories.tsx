import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"
import { PlatformBadge } from "./platform-badge"

const SparkleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3z" />
  </svg>
)

// The static brand tile — `PlatformSwitcher`'s visual without the menu. Use it
// wherever the tile is decorative/identifying only; it is not focusable and
// does not bundle the dropdown code.
const meta: Meta<typeof PlatformBadge> = {
  title: "Components/PlatformBadge",
  component: PlatformBadge,
  args: {
    label: "Luminality",
    icon: <SparkleIcon />,
  },
  argTypes: {
    label: { control: "text" },
    icon: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof PlatformBadge>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tile = canvas.getByRole("img", { name: "Luminality" })
    await expect(tile).toBeInTheDocument()
    await expect(canvas.queryByRole("button")).toBeNull()
  },
}
