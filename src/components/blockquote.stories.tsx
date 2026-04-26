import type { Meta, StoryObj } from "@storybook/react-vite"
import { Blockquote } from "./blockquote"

const meta: Meta<typeof Blockquote> = {
  title: "Components/Blockquote",
  component: Blockquote,
}

export default meta
type Story = StoryObj<typeof Blockquote>

export const Default: Story = {
  args: {
    children:
      "The best way to predict the future is to invent it. The future is not laid out on a track. It is something that we can decide.",
  },
}

export const WithAttribution: Story = {
  args: {
    children:
      "Design is not just what it looks like and feels like. Design is how it works.",
    author: "Steve Jobs",
    source: "The New York Times, 2003",
  },
}
