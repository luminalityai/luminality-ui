/// <reference types="vitest" />
import { defaultExclude, defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"
import { playwright } from "@vitest/browser-playwright"
import { resolve } from "path"
import { fileURLToPath } from "node:url"

const dirname = fileURLToPath(new URL(".", import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(dirname, "./src"),
    },
  },
  test: {
    coverage: {
      provider: "v8",
      all: true,
      include: ["src/components/**", "src/lib/**", "src/hooks/**"],
      exclude: [
        "src/test/**",
        "src/components/index.ts",
        // Stories are exercised by the Storybook browser project, not the unit
        // project; they are not published source, so keep them out of the
        // unit-test coverage measurement.
        "src/**/*.stories.tsx",
      ],
      // Floors set a few points below the measured coverage (lines 96.03,
      // statements 96.14, functions 92.47, branches 92.25) so they lock in
      // current coverage without being brittle to minor churn.
      thresholds: {
        lines: 93,
        functions: 88,
        branches: 88,
        statements: 93,
      },
    },
    projects: [
      // Existing unit + a11y tests, jsdom environment.
      {
        plugins: [react()],
        resolve: {
          alias: {
            "@": resolve(dirname, "./src"),
          },
        },
        test: {
          name: "unit",
          environment: "jsdom",
          setupFiles: ["./src/test/setup.ts"],
          include: ["src/test/**/*.{test,spec}.{ts,tsx}"],
          exclude: [
            ...defaultExclude,
            ".worktrees/**",
            ".claude/worktrees/**",
            "e2e/**",
          ],
        },
      },
      // Storybook stories run as tests in a real browser (Playwright Chromium):
      // mounts each story, runs its `play` function, and runs the a11y checks.
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: resolve(dirname, ".storybook"),
            storybookScript: "npm run storybook -- --ci",
          }),
        ],
        resolve: {
          alias: {
            "@": resolve(dirname, "./src"),
          },
        },
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
})
