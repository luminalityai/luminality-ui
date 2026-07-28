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
  decorators: [withTheme],
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
