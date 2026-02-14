# @rarebit-one/luminality-ui

Shared design system package for Luminality applications.

## Installation

This package is published to GitHub Packages. Configure the registry scope and install:

```bash
# Add to your project's .npmrc (requires GitHub authentication)
@rarebit-one:registry=https://npm.pkg.github.com

# Install
npm install @rarebit-one/luminality-ui
```

### Peer dependencies

This package requires the following peer dependencies:

- `react` ^19.0.0
- `react-dom` ^19.0.0
- `tailwindcss` ^4.0.0
- `tw-animate-css` ^1.0.0

## Usage

```tsx
import { Button, Card, Dialog, AlertDialog } from "@rarebit-one/luminality-ui";
```

Import the stylesheet in your CSS:

```css
@import "@rarebit-one/luminality-ui/styles/index.css";
```

## Scripts

- `npm run build` — compile TypeScript to `dist/`
- `npm run typecheck` — run TypeScript type checking
- `npm run clean` — remove build artifacts
