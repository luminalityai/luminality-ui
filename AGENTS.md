# AGENTS.md

> Documentation for AI agents working on the luminality-ui codebase.

## Overview

`@rarebit-one/luminality-ui` is a React 19 component library (design system) built with TypeScript, Radix UI primitives, and Tailwind CSS v4. It is published to GitHub Packages as a scoped npm package.

## Setup

```bash
npm ci
```

Requires Node.js >= 20.

## Build

```bash
npm run build       # Clean + compile (tsc)
npm run typecheck   # Type check without emitting
```

Build output goes to `dist/`. The build config (`tsconfig.build.json`) excludes `src/test/`.

## Test

```bash
npm test            # Vitest single run
npm run test:watch  # Vitest in watch mode
npm run test:coverage  # Run with v8 coverage report
```

- Test framework: **Vitest** with **jsdom** environment
- Assertion/DOM: `@testing-library/react`, `@testing-library/jest-dom`
- Interactions: `@testing-library/user-event` (use named import: `import { userEvent } from "..."`)
- Tests live in `src/test/components/<component>.test.tsx`
- Each component has its own test file matching the component name

## Lint

```bash
npm run lint        # ESLint (TypeScript + React)
npm run lint:fix    # ESLint with auto-fix
```

ESLint config is in `eslint.config.mjs` (flat config format).

## Project Structure

```
src/
  components/       # All UI components (one file per component)
    index.ts        # Barrel export for all components
  lib/
    utils.ts        # cn() utility (clsx + tailwind-merge)
  styles/
    theme.css       # CSS custom properties (design tokens)
  index.ts          # Package entry point
  test/
    setup.ts        # Test setup (jest-dom matchers)
    components/     # Component test files
```

## Key Conventions

- **Module resolution**: `moduleResolution: "NodeNext"` — all local imports must use `.js` extensions (e.g., `import { cn } from "../lib/utils.js"`)
- **No default exports**: Components use named exports only
- **Radix UI**: Interactive components wrap Radix primitives with styled variants
- **CSS variables**: Theming uses CSS custom properties (`var(--color-*)`, `var(--radius-*)`)
- **`cn()` utility**: All className merging uses `cn()` from `src/lib/utils.ts`
- **Peer dependencies**: react 19, react-dom 19, tailwindcss 4, tw-animate-css 1

## CI

CI runs on every PR and push to `main` via GitHub Actions (`.github/workflows/ci.yml`):
1. `npm ci`
2. `npm run lint`
3. `npm test`
4. `npm run typecheck`
5. `npm run build`
6. `npm pack --dry-run`

All steps must pass before merge.

## Publishing

Published to GitHub Packages (`npm.pkg.github.com`) via `.github/workflows/publish.yml`. Version is managed manually in `package.json`.
