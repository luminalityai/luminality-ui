import type { Preview } from "@storybook/react-vite"
import "../src/styles/index.css"

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Fail the Storybook test run (CI `storybook` job) on accessibility
      // violations, rather than just reporting them.
      test: "error",
    },
  },
}

export default preview
