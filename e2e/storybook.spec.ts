import { expect, test } from "@playwright/test"

/**
 * Visual regression tests against Storybook iframe URLs.
 *
 * Story IDs below are placeholders — update to match actual Storybook titles
 * once story files are added under `src/**\/*.stories.@(ts|tsx)`. Story IDs are
 * derived from the story file titles. Run
 * `npx playwright test --update-snapshots` once to generate baselines.
 */

const stories = [
  { id: "components-button--default", name: "button-default" },
  { id: "components-button--variants", name: "button-variants" },
  { id: "components-dialog--default", name: "dialog-default" },
]

for (const story of stories) {
  test(`visual regression: ${story.name}`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story`)
    // Wait for Storybook to finish rendering the story root.
    await page.waitForSelector("#storybook-root", { state: "attached" })
    await page.waitForLoadState("networkidle")
    await expect(page).toHaveScreenshot(`${story.name}.png`, {
      fullPage: true,
      animations: "disabled",
    })
  })
}
