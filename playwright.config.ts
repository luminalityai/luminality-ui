import { defineConfig, devices } from "@playwright/test"

/**
 * Playwright config targeting Storybook's iframe at port 6006.
 *
 * Run Storybook in a separate terminal with `npm run storybook` before running
 * `npx playwright test`, or rely on the `webServer` block below to spawn it.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:6006",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run storybook -- --ci --quiet",
    url: "http://localhost:6006",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
