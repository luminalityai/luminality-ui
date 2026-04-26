import type { Meta, StoryObj } from "@storybook/react-vite"
import { Callout } from "./callout"

const meta: Meta<typeof Callout> = {
  title: "Components/Callout",
  component: Callout,
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "warning", "success", "danger", "note"],
    },
  },
}

export default meta
type Story = StoryObj<typeof Callout>

export const Default: Story = {
  args: {
    title: "Heads up",
    children:
      "This is a callout component used to draw attention to information.",
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-[480px]">
      <Callout variant="info" title="Info">
        Useful information about a feature or concept.
      </Callout>
      <Callout variant="warning" title="Warning">
        This action could have unintended side effects.
      </Callout>
      <Callout variant="success" title="Success">
        Your changes were saved successfully.
      </Callout>
      <Callout variant="danger" title="Danger">
        This action is destructive and cannot be undone.
      </Callout>
      <Callout variant="note" title="Note">
        A general note for the reader.
      </Callout>
    </div>
  ),
}
