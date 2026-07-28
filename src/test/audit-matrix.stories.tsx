import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

/**
 * Permanent tripwires for the accessibility audit matrix.
 *
 * `vitest.config.ts` runs every story four times — {phone 414, desktop 1280} x
 * {light, dark} — by pinning Storybook's `viewport` and `theme` globals through
 * each browser instance's `provide` key. That wiring is load-bearing and
 * entirely non-obvious: a dependency bump that changes the provide key, the
 * globals' shape, or `setViewport()`'s precedence collapses all four instances
 * back onto a single cell — and EVERY story still passes, and the test count is
 * still exactly 4x. There is no other signal. These two stories are it.
 *
 * Both derive their expectation from the VITEST INSTANCE NAME rather than from
 * an allow-list, and for the theme axis that is the whole point:
 *
 *  - A dead WIDTH axis is self-evident. It reports 1200 — `addon-vitest`'s own
 *    hardcoded default, a value no instance ever asks for.
 *  - A dead THEME axis is not. It falls back to whatever `initialGlobals` pins,
 *    which is a perfectly legitimate value, so
 *    `expect(["light", "dark"]).toContain(theme)` would PASS in exactly the
 *    broken state it exists to catch.
 *
 * Negative-tested when added: deleting `theme` from the instances' `provide`
 * made `AuditsBothThemes` fail on the two dark instances with
 * `expected 'light' to be 'dark'`, and reinstating the inert per-instance
 * `viewport` key made `AuditsBothWidths` fail everywhere with
 * `expected 1200 to be 414`. A guard nobody has watched fail is not yet a guard.
 */

/** The Vitest project name, e.g. `storybook-mobile-dark`. */
function instanceName(): string {
  const name = (
    globalThis as unknown as {
      __vitest_worker__?: { config?: { name?: string } }
    }
  ).__vitest_worker__?.config?.name
  if (!name)
    throw new Error(
      "No Vitest instance name — is this running under the browser project?",
    )
  return name
}

function expectedFromInstance(): { width: number; theme: "light" | "dark" } {
  const name = instanceName()
  const match = /^storybook-(mobile|desktop)-(light|dark)$/.exec(name)
  if (!match) {
    throw new Error(
      `Unrecognised Vitest instance name "${name}". The audit matrix expects ` +
        `storybook-{mobile,desktop}-{light,dark}; if the instances were renamed, ` +
        `update this tripwire rather than widening it.`,
    )
  }
  return {
    width: match[1] === "mobile" ? 414 : 1280,
    theme: match[2] as "light" | "dark",
  }
}

function AuditMatrixProbe() {
  return (
    <div className="bg-[var(--color-background)] p-4">
      <p className="text-[var(--color-text)]">
        Audit matrix probe — asserts the viewport and theme axes are alive.
      </p>
    </div>
  )
}

const meta = {
  title: "Test/AuditMatrix",
  component: AuditMatrixProbe,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AuditMatrixProbe>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The width axis. 1200 is `addon-vitest`'s un-overridden default and means the
 * viewport wiring is dead. Do NOT widen this assertion if it fails.
 */
export const AuditsBothWidths: Story = {
  play: async () => {
    const { width } = expectedFromInstance()
    await expect(window.innerWidth).toBe(width)
  },
}

/**
 * The theme axis — global, and then its CONSEQUENCE, so a theme that arrives in
 * `globals` but never reaches the DOM (broken decorator, renamed
 * `[data-theme]` block, dropped stylesheet) fails too.
 */
export const AuditsBothThemes: Story = {
  play: async ({ globals }) => {
    const { theme } = expectedFromInstance()

    // 1. the global actually arrived on this instance
    await expect(globals.theme).toBe(theme)

    // 2. the decorator applied it to the DOM
    await expect(document.documentElement.getAttribute("data-theme")).toBe(
      theme,
    )

    // 3. the stylesheet responded — `--color-background` is the canvas and is
    //    the token most obviously different between the two themes
    //    (light #faf8f3 vs dark #1a1815).
    const background = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-background")
      .trim()
      .toLowerCase()
    await expect(background).toBe(theme === "dark" ? "#1a1815" : "#faf8f3")
  },
}
