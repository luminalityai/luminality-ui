import type { StorybookConfig } from "@storybook/react-vite"
import tailwindcss from "@tailwindcss/vite"
import { mergeConfig } from "vite"

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-vitest"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // Storybook's Vite pipeline is isolated; mirror the Tailwind plugin from vite.config.ts.
  viteFinal: async (config) =>
    mergeConfig(config, {
      plugins: [tailwindcss()],
      optimizeDeps: {
        // Pre-bundle Radix primitives so portal/overlay content mounted during
        // interaction (`play`) tests resolves a single shared React instance,
        // rather than lazy-loading a second copy mid-test (which crashes with
        // "Cannot read properties of null (reading 'useRef')").
        include: [
          "react",
          "react-dom",
          "react-dom/client",
          "react/jsx-runtime",
          "react/jsx-dev-runtime",
          "@radix-ui/react-accordion",
          "@radix-ui/react-alert-dialog",
          "@radix-ui/react-avatar",
          "@radix-ui/react-checkbox",
          "@radix-ui/react-dialog",
          "@radix-ui/react-dropdown-menu",
          "@radix-ui/react-separator",
          "@radix-ui/react-slot",
          "@radix-ui/react-tabs",
          "@radix-ui/react-tooltip",
        ],
      },
    }),
}

export default config
