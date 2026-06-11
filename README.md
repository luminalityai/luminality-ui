# @luminalityai/ui

Shared design system package for Luminality applications.

## Installation

Published to the public npm registry:

```bash
npm install @luminalityai/ui
```

### Peer dependencies

This package requires the following peer dependencies:

- `react` ^19.0.0
- `react-dom` ^19.0.0
- `tailwindcss` ^4.0.0
- `tw-animate-css` ^1.0.0

## Usage

```tsx
import { Button, Card, Dialog, AlertDialog } from "@luminalityai/ui"
```

Import the stylesheet in your CSS:

```css
@import "@luminalityai/ui/styles/index.css";
```

## Scripts

- `npm run build` — compile TypeScript to `dist/`
- `npm run typecheck` — run TypeScript type checking
- `npm run clean` — remove build artifacts
