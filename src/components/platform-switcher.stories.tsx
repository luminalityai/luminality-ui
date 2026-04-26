import type { Meta, StoryObj } from "@storybook/react-vite"
import { PlatformSwitcher } from "./platform-switcher"

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

const AppIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

const meta: Meta<typeof PlatformSwitcher> = {
  title: "Components/PlatformSwitcher",
  component: PlatformSwitcher,
}

export default meta
type Story = StoryObj<typeof PlatformSwitcher>

export const Default: Story = {
  render: () => (
    <PlatformSwitcher
      icon={<SparkleIcon />}
      label="Luminality"
      linkedApps={[
        { name: "Nutripod", icon: <AppIcon />, href: "https://example.com" },
        { name: "Fundbright", icon: <AppIcon />, href: "https://example.com" },
      ]}
      organisations={[
        { id: "org-1", name: "Acme Inc." },
        { id: "org-2", name: "Globex" },
      ]}
      activeOrganisationId="org-1"
    />
  ),
}

export const Static: Story = {
  render: () => (
    <PlatformSwitcher
      icon={<SparkleIcon />}
      label="Luminality"
      interactive={false}
    />
  ),
}
