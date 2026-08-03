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
          // Vitest's 5s default is not survivable on a contended machine, and
          // these tests fail on STARVATION rather than on anything they assert.
          //
          // Measured on a 10-core laptop (luminalityai/delivery-ops#308):
          //
          //   quiet-ish machine, suite alone .... slowest test  2.4s
          //   full pre-push fan-out (6 jobs) .... slowest test  4.4s  (87% of 5s)
          //   loaded machine, suite alone ....... slowest test  7.3s  -> FAILS
          //
          // The failures are exactly the tests that crossed 5000ms — jsdom
          // `userEvent` interactions and the axe passes, both of which do a lot
          // of async work per assertion and degrade linearly with CPU
          // contention. Nothing about them is genuinely slow; they queue.
          //
          // Note the last row: the suite blows the 5s ceiling with NO other
          // pre-push job running, purely from unrelated load on the box. That
          // is why the ceiling — not lefthook's `parallel: true` — is the fix
          // here; serialising the hook was measured and does not prevent it.
          //
          // 20s is ~3x the worst observed starvation and ~8x the quiet-machine
          // worst case. Passing tests never wait for a timeout, so a high
          // ceiling costs nothing on green runs; it only changes how long a
          // genuinely hung test takes to report, which is still 20s.
          testTimeout: 20_000,
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
          // Every story now runs FOUR times (see `instances` below), so the
          // pool is four times as contended. Vitest's 5s default is not
          // survivable under that: files fail on queueing, not on anything a
          // story does. Raised 120s -> 180s when the theme axis doubled the
          // instance count again; never lower it to "speed up" a saturated run.
          testTimeout: 180_000,
          hookTimeout: 180_000,
          // Each instance is a separate project with its own pool of headless
          // browser contexts, so leaving this unbounded doubles the concurrent
          // Chromium count and starves the runner — files then die on "Cannot
          // connect to the server in 60 seconds". Cap it per instance.
          maxWorkers: 3,
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            // Audit every story at BOTH a phone and a desktop width.
            //
            // NB the viewport is NOT set via `browser.viewport` or the
            // per-instance `viewport` key. Both are inert here:
            //
            //  1. `@vitest/browser-playwright` 4.1.x has the line that would
            //     apply it to the Playwright context commented out, so Vitest's
            //     documented 414x896 default never reaches the browser; and
            //  2. `@storybook/addon-vitest` calls `page.viewport(w, h)` before
            //     EVERY story from `setViewport()` in its own test-utils, which
            //     would override it regardless. With no Storybook viewport
            //     selected it uses that helper's own hardcoded default of
            //     1200x900 — which is why the pre-existing baseline was in fact
            //     a ~desktop measurement, not the 414x896 phone one Vitest's
            //     docs imply.
            //
            // The lever that actually works is Storybook's own viewport global,
            // which addon-vitest reads from the `storybook/test-initial-globals`
            // provide key — and `provide` IS settable per instance. The values
            // below are the built-in MINIMAL_VIEWPORTS entries: `mobile2` is
            // 414x896 and `desktop` is 1280x1024.
            //
            // Both widths therefore widen coverage relative to the old
            // 1200x900 run: `mobile2` reaches everything below `md:` (which was
            // never audited anywhere in the estate), and `desktop` reaches `xl:`
            // (1280) which 1200 did not.
            //
            // !! That lever requires @storybook/addon-vitest >= 10.5.0. This
            // repo was on 10.4.6, which does not read the
            // `storybook/test-initial-globals` provide key AT ALL — so the
            // two-width matrix landed in #169 was inert and BOTH instances were
            // in fact running at 1200x900. `src/test/audit-matrix.stories.tsx`
            // is what caught that, and is exactly why the tripwire is committed
            // rather than thrown away. Do not drop the addon below 10.5.
            //
            // ...and at BOTH themes. This package ships a light `@theme`
            // default AND a `[data-theme="dark"]` override block, so it
            // publishes two palettes — but Storybook pinned neither, so every
            // story only ever rendered light and the dark palette had never
            // been audited at all.
            //
            // Theme rides the SAME `storybook/test-initial-globals` provide key
            // as the viewport, and both globals MUST live in one object
            // literal: a per-instance `provide` REPLACES the plugin's provide
            // object rather than merging into it, so a second `provide` entry
            // silently drops the first.
            //
            // A full 2x2 rather than a cheaper L-shape, because the axes are
            // independent: width decides WHICH elements exist (anything behind
            // an `md:`/`lg:` breakpoint is unreachable — not passing — at the
            // other width) and theme decides WHAT COLOUR they are.
            instances: [
              {
                browser: "chromium",
                name: "storybook-mobile-light",
                provide: {
                  "storybook/test-initial-globals": {
                    viewport: { value: "mobile2" },
                    theme: "light",
                  },
                },
              },
              {
                browser: "chromium",
                name: "storybook-mobile-dark",
                provide: {
                  "storybook/test-initial-globals": {
                    viewport: { value: "mobile2" },
                    theme: "dark",
                  },
                },
              },
              {
                browser: "chromium",
                name: "storybook-desktop-light",
                provide: {
                  "storybook/test-initial-globals": {
                    viewport: { value: "desktop" },
                    theme: "light",
                  },
                },
              },
              {
                browser: "chromium",
                name: "storybook-desktop-dark",
                provide: {
                  "storybook/test-initial-globals": {
                    viewport: { value: "desktop" },
                    theme: "dark",
                  },
                },
              },
            ],
          },
        },
      },
    ],
  },
})
