# AGENTS.md

> Documentation for AI agents working on the luminality-ui codebase.

## Overview

`@luminalityai/ui` is a React 19 component library (design system) built with TypeScript, Radix UI primitives, and Tailwind CSS v4. It is published to the public npm registry (registry.npmjs.org) as a scoped package.

## Setup

```bash
npm ci
```

Requires Node.js >= 20.

## Build

```bash
npm run build       # Bundle with Vite (vite build)
npm run check       # Type check without emitting (tsc --noEmit)
```

Build output goes to `dist/`. The build runs through Vite (`vite.config.ts`); type declarations are emitted by `vite-plugin-dts`.

## Test

```bash
npm test            # Vitest single run
npm run test:watch  # Vitest in watch mode
npm run test:coverage  # Run with v8 coverage report
```

- Test framework: **Vitest** with **jsdom** environment
- Assertion/DOM: `@testing-library/react`, `@testing-library/jest-dom`
- Interactions: `@testing-library/user-event` (import as `import { userEvent } from "@testing-library/user-event"`, then use `userEvent.setup()`)
- Tests live in `src/test/components/<component>.test.tsx`
- Each component has its own test file matching the component name

## Lint

```bash
npm run lint        # ESLint (TypeScript + React)
npm run lint:fix    # ESLint with auto-fix
```

ESLint config is in `eslint.config.mjs` (flat config format).

## Format

```bash
npm run format       # Prettier auto-format
npm run format:check # Check formatting without writing
```

Prettier config is in `.prettierrc.json`.

## Code Quality

```bash
npm run knip         # Detect unused code, exports, and dependencies
```

Knip config is in `knip.json`.

## Project Structure

```
src/
  components/       # ~21 UI components (one file per component)
    index.ts        # Barrel export for all components
  lib/
    utils.ts        # cn() utility (clsx + tailwind-merge)
    format-date.ts  # formatDate / formatDateTime / formatRelativeTime / getLocalTimezone
    json-utils.ts   # parseJsonError / formatJson
  hooks/
    use-debounce.ts # useDebounce hook
  styles/
    index.css       # Entry stylesheet: @import "tailwindcss" + @plugin "tailwindcss-animate", pulls in theme.css + animations.css
    theme.css       # CSS custom properties (design tokens)
    animations.css  # Keyframes / animation utilities
  index.ts          # Package entry point (re-exports cn, formatDate*, parseJsonError, formatJson, useDebounce, and all components)
  test/
    setup.ts        # Test setup (jest-dom matchers)
    components/     # Component test files
```

## Key Conventions

- **Module resolution**: `moduleResolution: "bundler"` — use extensionless local imports (e.g., `import { cn } from "../lib/utils"`). Do **not** add `.js` extensions.
- **No default exports**: Components use named exports only
- **Radix UI**: Interactive components wrap Radix primitives with styled variants
- **CSS variables**: Theming uses CSS custom properties (`var(--color-*)`, `var(--radius-*)`)
- **`cn()` utility**: All className merging uses `cn()` from `src/lib/utils.ts`
- **Peer dependencies**: only `react` ^19 and `react-dom` ^19 are declared as peers. Tailwind CSS v4 and `tailwindcss-animate` are bundled as regular dependencies (`tailwindcss-animate` is wired via `@plugin "tailwindcss-animate"` in `src/styles/index.css`).

## CI

CI runs on every PR and push to `main` via GitHub Actions (`.github/workflows/ci.yml`):

1. `npm ci`
2. `npm run lint`
3. `npm run format:check`
4. `npm run knip`
5. `npm test`
6. `npm run check` (typecheck)
7. `npm run build`
8. `npm pack --dry-run`

All steps must pass before merge.

## Publishing

Published to the public npm registry (registry.npmjs.org) via `.github/workflows/publish.yml`. Version is managed manually in `package.json`.
