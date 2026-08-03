import type { Decorator, Preview } from "@storybook/react-vite"
import "../src/styles/index.css"

/**
 * Applies the selected theme the same way a consuming app does: a `data-theme`
 * attribute on `<html>`, which `src/styles/theme.css` keys its dark overrides
 * off. There is no other mechanism — the package ships a light default in
 * `@theme` and a single `[data-theme="dark"]` override block.
 *
 * Light is the default so the visual-regression baselines in `e2e/` (which load
 * `iframe.html?id=…` with no globals) keep rendering exactly what they did
 * before this global existed: `[data-theme="light"]` matches no rule.
 */
/**
 * Paint the canvas — but ONLY under Vitest browser mode.
 *
 * A component library deliberately does not paint `<body>`; that is the
 * consuming app's job. Under the a11y gate that is a measurement bug: any story
 * wider than the viewport (or laid out `fullscreen`) overhangs its wrapper onto
 * the bare body, and axe then measures the theme's foreground tokens against the
 * browser default WHITE. In dark theme that produced 214 phantom
 * `color-contrast` nodes — `#faf8f3` on `#ffffff`, 1.06:1 — for text that is
 * 15.9:1 on the real `#1a1815` canvas.
 *
 * The paint is gated on `__vitest_browser__` because `e2e/storybook.spec.ts`
 * takes FULL-PAGE screenshots of this same preview iframe against 14 committed
 * `*-chromium-linux` baselines. Painting unconditionally would invalidate every
 * one of them. `vitest.config.ts` is insulated from the visual-regression job;
 * `.storybook/preview.ts` is not.
 */
if (
  typeof document !== "undefined" &&
  (globalThis as { __vitest_browser__?: boolean }).__vitest_browser__
) {
  const style = document.createElement("style")
  style.textContent = `html, body {
    background-color: var(--color-background);
    color: var(--color-text);
  }`
  document.head.appendChild(style)
}

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme === "dark" ? "dark" : "light"
  document.documentElement.setAttribute("data-theme", theme)
  return Story()
}

/**
 * Freeze entry animations and transitions — for the TEST RUNNER ONLY.
 *
 * axe measures COMPUTED style. A component that fades, zooms or slides in is,
 * for the length of its animation, a different element than the one that ships:
 * partly transparent, partly offset, and composited against whatever is behind
 * it. A contrast reading taken mid-animation is therefore a reading of a frame
 * no user ever settles on, and it is a different number every run.
 *
 * That is not theoretical. On `fundbright-web` the same gap produced a
 * deterministic 2.17:1 contrast failure that the gate FAILED on in one PR and
 * PASSED on `main` with byte-identical code — a real violation reached
 * production through a green pipeline. The measured cause there: the probe read
 * `opacity: 0`, i.e. axe was sampling a fully invisible element, so there was no
 * colour to measure and whether anything got reported at all was a coin flip.
 *
 * This package is squarely exposed: `dialog`, `alert-dialog`, `dropdown-menu`
 * and `tooltip` all mount through `tailwindcss-animate`'s
 * `data-[state=open]:animate-in … fade-in-0 … zoom-in-95 … slide-in-from-*`,
 * and `src/styles/animations.css` ships hand-written `animate-fade-in` /
 * `animate-accordion-*` on top of that. Two mechanisms, both animating opacity.
 *
 * `1ms` rather than `none`, deliberately: `animation: none` can leave an element
 * at its PRE-animation base state, which for an entry animation is the invisible
 * one — trading a random frame for a guaranteed-wrong frame. Running the
 * animation to completion in 1ms with a negative delay lands every element on
 * its FINAL frame instead, which is the state that ships.
 *
 * Gated on the runner so interactive Storybook keeps its animations: motion is a
 * design property and reviewers should see it. That matters more here than in an
 * app — this Storybook is the published, browsable catalog for the design
 * system. `__vitest_worker__` is the same discriminator
 * `src/test/audit-matrix.stories.tsx` already uses to read its instance name.
 *
 * The freeze fails SILENTLY if it stops applying — stories just go back to being
 * flaky, which reads as ordinary CI noise and gets retried rather than
 * investigated. `FreezesEntryAnimations` in `src/test/audit-matrix.stories.tsx`
 * asserts it is live.
 */
const FROZEN_MOTION_STYLE_ID = "sb-frozen-motion"

const withFrozenMotion: Decorator = (Story) => {
  const underTestRunner = "__vitest_worker__" in globalThis
  if (underTestRunner && !document.getElementById(FROZEN_MOTION_STYLE_ID)) {
    const style = document.createElement("style")
    style.id = FROZEN_MOTION_STYLE_ID
    style.textContent = `*, *::before, *::after {
      animation-delay: -1ms !important;
      animation-duration: 1ms !important;
      animation-iteration-count: 1 !important;
      transition-delay: -1ms !important;
      transition-duration: 1ms !important;
      scroll-behavior: auto !important;
    }`
    document.head.appendChild(style)
  }
  return Story()
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description:
        "Color theme (sets data-theme on <html>, as a consumer does)",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [withTheme, withFrozenMotion],
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
