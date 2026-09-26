# @luminalityai/ui

Shared design system package for Luminality applications.

## Installation

Published to the public npm registry:

```bash
npm install @luminalityai/ui
```

### Peer dependencies

This package declares the following peer dependencies (you must supply them):

- `react` ^19
- `react-dom` ^19

The package's stylesheet is precompiled: Tailwind CSS v4 and its animation utilities (`tw-animate-css`) are built into `@luminalityai/ui/styles`, so you do not need to install them yourself.

## Usage

```tsx
import { Button, Card, Dialog, AlertDialog } from "@luminalityai/ui"
```

Import the stylesheet in your CSS:

```css
@import "@luminalityai/ui/styles/index.css";
```

## Scripts

See the `scripts` block in [`package.json`](./package.json) for the authoritative list. The most common ones:

- `npm run build` — build the package to `dist/` with Vite (`vite build`; types rolled up into one `dist/index.d.ts` via `vite-plugin-dts` + `@microsoft/api-extractor`, checked by `node scripts/verify-dts.mjs`)
- `npm run check` — type-check without emitting (`tsc --noEmit`)
- `npm run lint` — run ESLint
- `npm test` — run the Vitest unit suite
