import type { Meta, StoryObj } from "@storybook/react-vite"
import { Time } from "./time"

const meta: Meta<typeof Time> = {
  title: "Components/Time",
  component: Time,
}

export default meta
type Story = StoryObj<typeof Time>

const sampleDate = "2026-04-26T14:30:00Z"

export const Default: Story = {
  args: {
    date: sampleDate,
    format: "date",
    timezone: "UTC",
  },
}

export const Formats: Story = {
  render: () => (
    <div className="flex flex-col gap-2 text-sm text-[var(--color-text)]">
      <div>
        Date: <Time date={sampleDate} format="date" timezone="UTC" />
      </div>
      <div>
        DateTime: <Time date={sampleDate} format="datetime" timezone="UTC" />
      </div>
      <div>
        DateTime + TZ:{" "}
        <Time date={sampleDate} format="datetime-tz" timezone="UTC" />
      </div>
      <div>
        Relative: <Time date={sampleDate} format="relative" />
      </div>
    </div>
  ),
}

export const NullDate: Story = {
  args: {
    date: null,
  },
}
