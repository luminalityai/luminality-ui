import { expect, test } from "@playwright/test"

/**
 * Visual regression tests against Storybook iframe URLs.
 *
 * Story IDs are derived from the story file titles (e.g. `Components/Button`
 * -> `components-button`) and the exported story name. Run
 * `npx playwright test --update-snapshots` once on a green CI run to generate
 * baselines.
 */

const stories = [
  // Basic / atomic components
  { id: "components-button--default", name: "button-default" },
  { id: "components-button--variants", name: "button-variants" },
  { id: "components-badge--variants", name: "badge-variants" },
  { id: "components-status--variants", name: "status-variants" },
  { id: "components-callout--variants", name: "callout-variants" },
  // Layout / composite
  { id: "components-card--default", name: "card-default" },
  { id: "components-emptystate--default", name: "empty-state-default" },
  {
    id: "components-pageheader--with-breadcrumbs-and-actions",
    name: "page-header-with-breadcrumbs-and-actions",
  },
  { id: "components-list--with-sections", name: "list-with-sections" },
  // Interactive (open state)
  { id: "components-dialog--open", name: "dialog-open" },
  { id: "components-alertdialog--open", name: "alert-dialog-open" },
  { id: "components-dropdownmenu--open", name: "dropdown-menu-open" },
  { id: "components-tooltip--open", name: "tooltip-open" },
  { id: "components-accordion--open", name: "accordion-open" },
  { id: "components-tabs--default", name: "tabs-default" },
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
