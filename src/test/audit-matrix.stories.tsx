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
 * still exactly 4x. There is no other signal. `AuditsBothWidths` and
 * `AuditsBothThemes` are it.
 *
 * `FreezesEntryAnimations` covers a third axis that is not about coverage but
 * about determinism: whether the frame axe samples is the settled one. It fails
 * silently in the same way — as flakiness rather than as a failure.
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

/**
 * Carries this repo's REAL animation utilities rather than a hand-written
 * `@keyframes`, and both of the mechanisms actually in play:
 *
 *  - the `tailwindcss-animate` plugin classes that `dialog`, `alert-dialog`,
 *    `dropdown-menu` and `tooltip` mount with (`data-[state=open]:animate-in`
 *    + `fade-in-0` + `zoom-in-95` + `slide-in-from-top-*`), driven here by a
 *    literal `data-state="open"` so the variants apply without a Radix root; and
 *  - `animate-fade-in` from `src/styles/animations.css`, which is hand-written
 *    and ships in the package's CSS for consumers.
 *
 * The freeze has to beat whatever those emit. A bespoke animation here would let
 * this tripwire keep passing after a `tailwindcss-animate` upgrade changed the
 * mechanism out from under it.
 *
 * `duration-1000` rather than the components' own `duration-200`: the assertion
 * has to be able to FAIL when the freeze is removed, and 200ms is short enough
 * that the play function could land after it finished by luck. Colours are
 * pinned inline (#000000 on #ffffff, 21:1) so the probe can never itself trip
 * the contrast gate — in either theme.
 */
function MotionProbe() {
  return (
    <div>
      <output
        data-testid="motion-probe"
        data-state="open"
        className="block duration-1000 ease-out data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-[48%]"
        style={{ backgroundColor: "#ffffff", color: "#000000" }}
      >
        Motion probe (tailwindcss-animate) — asserts the gate samples settled
        frames, not mid-animation ones.
      </output>
      <output
        data-testid="motion-probe-keyframes"
        className="block animate-fade-in"
        style={{ backgroundColor: "#ffffff", color: "#000000" }}
      >
        Motion probe (hand-written animations.css) — same assertion, other
        mechanism.
      </output>
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

/**
 * The DETERMINISM axis — not about coverage, but about whether the frame axe
 * samples is the settled one.
 *
 * axe reads computed style. While a component is fading, zooming or sliding in
 * it is partly transparent and partly offset, so its contrast is a different
 * number than the one that ships — and a different number on each run, depending
 * on where the sample lands in the animation. On `fundbright-web` that produced
 * the worst possible outcome: a 2.17:1 button FAILED the gate on one PR and
 * PASSED on `main` with byte-identical code, so a real violation reached
 * production through a green pipeline.
 *
 * `.storybook/preview.ts` fixes this by collapsing every animation and
 * transition to 1ms with a negative delay under the test runner, landing each
 * element on its final frame. This story asserts that freeze is actually in
 * effect, because if it silently stops applying the symptom is not a failure —
 * it is a return to intermittent flakiness, which reads as ordinary CI noise.
 *
 * The assertion is on RENDERED OPACITY, not on the presence of the style tag.
 * The style tag existing proves nothing about whether its rule won the cascade;
 * opacity is the property axe actually consumes.
 *
 * Negative control: removing `withFrozenMotion` from the `decorators` array in
 * `.storybook/preview.ts` must make this story fail. Verified by doing exactly
 * that — and the unfrozen reading was **opacity 0 on all four instances**
 * (storybook-{mobile,desktop}-{light,dark}), not some partial value. axe was
 * sampling a fully invisible element, which is why the result is a coin flip
 * rather than a consistently wrong number: at opacity 0 there is no colour to
 * measure, so whether a contrast violation is reported at all depends on where
 * the sample lands. If you change the freeze, re-run that check; a tripwire that
 * has never been seen to fail is not a tripwire.
 */
export const FreezesEntryAnimations: Story = {
  render: () => <MotionProbe />,
  play: async ({ canvas }) => {
    const probe = canvas.getByTestId("motion-probe")
    const computed = getComputedStyle(probe)

    // The frame axe would measure. Anything below 1 is a frame no user settles
    // on, and the contrast reading taken from it is meaningless.
    await expect(computed.opacity).toBe("1")

    // Belt and braces on the mechanism itself: a `duration-1000` element whose
    // animation is still declared as running would drift back to flaky even if
    // this particular sample happened to land at full opacity.
    await expect(computed.animationDuration).toBe("0.001s")

    // The second mechanism. `animate-fade-in` bakes its 0.3s into
    // `animations.css`, so no utility can lengthen it — the duration assertion
    // is the reliable one here, and it is the one that proves the freeze reaches
    // hand-written keyframes and not just the plugin's.
    const keyframesProbe = canvas.getByTestId("motion-probe-keyframes")
    await expect(getComputedStyle(keyframesProbe).animationDuration).toBe(
      "0.001s",
    )
  },
}
