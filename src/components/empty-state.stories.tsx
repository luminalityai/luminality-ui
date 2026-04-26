import type { Meta, StoryObj } from "@storybook/react-vite"
import { EmptyState } from "./empty-state"
import { Button } from "./button"

const InboxIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
)

const meta: Meta<typeof EmptyState> = {
  title: "Components/EmptyState",
  component: EmptyState,
}

export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {
  render: () => (
    <div className="w-[480px]">
      <EmptyState
        icon={InboxIcon}
        heading="No messages yet"
        description="When someone sends you a message, it will show up here."
      />
    </div>
  ),
}

export const WithAction: Story = {
  render: () => (
    <div className="w-[480px]">
      <EmptyState
        icon={InboxIcon}
        heading="No messages yet"
        description="When someone sends you a message, it will show up here."
        action={<Button>Compose message</Button>}
      />
    </div>
  ),
}
