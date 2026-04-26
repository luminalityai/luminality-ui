import type { Meta, StoryObj } from "@storybook/react-vite"
import { Status } from "./status"

const meta: Meta<typeof Status> = {
  title: "Components/Status",
  component: Status,
  argTypes: {
    variant: {
      control: "select",
      options: [
        "active",
        "online",
        "offline",
        "completed",
        "failed",
        "cancelled",
        "processing",
      ],
    },
  },
}

export default meta
type Story = StoryObj<typeof Status>

export const Default: Story = {
  args: {
    children: "Active",
    variant: "active",
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Status variant="active">Active</Status>
      <Status variant="online">Online</Status>
      <Status variant="offline">Offline</Status>
      <Status variant="completed">Completed</Status>
      <Status variant="failed">Failed</Status>
      <Status variant="cancelled">Cancelled</Status>
      <Status variant="processing">Processing</Status>
    </div>
  ),
}
