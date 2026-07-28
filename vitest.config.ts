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
          // Every story now runs twice (see `instances` below), so the pool is
          // twice as contended. Vitest's 5s default is not survivable under
          // that: files fail on queueing, not on anything a story does.
          testTimeout: 120_000,
          hookTimeout: 120_000,
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
            // Both instances therefore widen coverage relative to the old
            // 1200x900 run: `mobile2` reaches everything below `md:` (which was
            // never audited anywhere in the estate), and `desktop` reaches `xl:`
            // (1280) which 1200 did not.
            instances: [
              {
                browser: "chromium",
                name: "storybook-mobile",
                provide: {
                  "storybook/test-initial-globals": {
                    viewport: { value: "mobile2" },
                  },
                },
              },
              {
                browser: "chromium",
                name: "storybook-desktop",
                provide: {
                  "storybook/test-initial-globals": {
                    viewport: { value: "desktop" },
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
