import type { StorybookConfig } from "@storybook/react-vite"
import tailwindcss from "@tailwindcss/vite"
import { mergeConfig } from "vite"

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // Storybook's Vite pipeline is isolated; mirror the Tailwind plugin from vite.config.ts.
  viteFinal: async (config) =>
    mergeConfig(config, { plugins: [tailwindcss()] }),
}

export default config
