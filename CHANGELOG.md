# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.9.0] - 2026-07-29

### Fixed

- **The dark theme now meets WCAG AA — it had never been audited at all.** The package ships two palettes (a light `@theme` default and a `[data-theme="dark"]` override block), but Storybook pinned neither, so every story only ever rendered light. Gating the dark theme surfaced **48 `color-contrast` nodes across 17 stories**, tracing to **five dark tokens plus one light one**:

  | token                             | theme | before                            | after     | worst background                       | ratio               |
  | --------------------------------- | ----- | --------------------------------- | --------- | -------------------------------------- | ------------------- |
  | `--color-primary-foreground-dark` | dark  | `#faf8f3`                         | `#1a1815` | `--color-primary-dark` `#e85d75`       | 3.16:1 → **5.28:1** |
  | `--color-primary-hover-dark`      | dark  | `#d94563`                         | `#ee7b8f` | (ink `#1a1815` on it)                  | 4.20:1 → **6.64:1** |
  | `--color-secondary-dark`          | dark  | `#9e5e8a`                         | `#935780` | (ink `#faf8f3` on it)                  | 4.47:1 → **5.05:1** |
  | `--color-text-muted-dark`         | dark  | `#8a7f6f`                         | `#a8a093` | `--color-surface-hover-dark` `#3a3228` | 3.20:1 → **4.87:1** |
  | `--color-muted-foreground-dark`   | dark  | `#9a8f7f`                         | `#bcb4aa` | `--color-muted-hover-dark` `#4a4238`   | 3.96:1 → **4.82:1** |
  | `--color-warning-text`            | light | `#946c00`                         | `#7d5b00` | `--color-muted-hover` `#e8e2d1`        | 4.49:1 → **4.82:1** |
  | `--color-warning-text-dark`       | dark  | _(none — the light value leaked)_ | `#cf9700` | `--color-surface-hover-dark` `#3a3228` | 3.71:1 → **4.85:1** |

  **No brand fill was retuned to satisfy a text bar.** `--color-primary-dark` `#e85d75` is untouched: like every other fill in the dark theme it is _light_, so the near-white ON colour was the defect, not the brand. Flipping the ink to the canvas near-black (`#1a1815`) matches what `--color-accent-foreground-dark`, `--color-info-foreground-dark`, `--color-success-foreground-dark`, `--color-danger-foreground-dark` and `--color-warning-foreground-dark` already did — primary and secondary were the outliers.

  `--color-warning-text` was the sharper lesson: it was tuned against `#ffffff` (4.60:1), but it renders on `--color-background` `#faf8f3`, where it measured **4.49:1** and failed. It also had **no dark counterpart at all**, so the light value leaked into the dark theme at 3.71:1.

  **4.5:1 (body text) was applied throughout** — every affected label is 10–16px at normal weight, so none reaches the 3:1 large-text allowance. The 3:1 non-text cases (focus rings, the outline Button border, the Checkbox fill) are never seen by axe and were reasoned about by hand; they use tokens that clear 4.5:1 and therefore 3:1 with room.

  **Consumer impact:** apps consuming `@luminalityai/ui/theme.css` or `@luminalityai/ui/styles` get the corrected values automatically. Dark-theme primary and secondary Buttons/Badges/Checkboxes now render **near-black** label text instead of cream — an intentional, visible change. Apps that override any of the seven tokens above should re-check their own values against the backgrounds listed.

### Changed

- The Storybook a11y gate now runs the full **2×2 matrix** — {phone 414, desktop 1280} × {light, dark} — instead of one width and one theme, with both globals pinned through each Vitest browser instance's `provide` key. 106 → **220** tests. `parameters.a11y.test` stays `'error'`; no rule is parked anywhere.
- `@storybook/{addon-vitest,addon-a11y,react-vite}` and `storybook` bumped to `^10.5.5`. **Required, not housekeeping:** the `storybook/test-initial-globals` provide key does not exist before `addon-vitest` 10.5, so the two-width matrix added in #169 was **inert** — both instances were in fact running at the addon's hardcoded 1200×900.

## [0.8.0] - 2026-07-15

### Added

- **New `@luminalityai/ui/theme.css` export — the raw design tokens, importable by apps that compile their own Tailwind.**

  The existing `@luminalityai/ui/styles` export is a complete ~32KB Tailwind build (banner, preflight, the lot). That's right for a consumer with no Tailwind of its own, but unusable for one that has it: importing it stacks a second Tailwind and a **duplicate preflight** on top of theirs. And the raw `theme.css` was never published (`files: ["dist"]`), so there was no third option.

  The consequence was predictable in hindsight — the only way to get these tokens into an app that already runs Tailwind was to **copy them**. luminality-web did exactly that, and the fork drifted: it still carries the pre-WCAG palette that 0.7.0 fixed, so **that accessibility fix never reached production** despite shipping to npm in June.

  Consumers with their own Tailwind can now share the tokens by reference:

  ```css
  @import "tailwindcss";
  @import "@luminalityai/ui/theme.css";
  ```

  Verified against a real consumer build: the raw import yields **1 preflight / ~7.5KB**, versus **2 preflights / ~46KB** for the compiled bundle. `@luminalityai/ui/styles` is unchanged and still correct for standalone use.

## [0.7.0] - 2026-06-22

### Changed

- **Darkened the brand color palette to meet WCAG AA contrast**, with automated accessibility checks now enforced in CI. Consumers using the default theme tokens will render slightly darker brand colors. (#143)
- The package is now published to npm via OIDC trusted publishing, auto-publishing when a GitHub Release is created. (#125)
- Storybook stories now run as interaction tests in CI with coverage floors; added a manual workflow to regenerate Playwright visual snapshots. (#142, #146)
- Routine dependency maintenance across the production and dev dependency groups (esbuild, Storybook, vitest 4.1.9, undici, and others). (#123, #135, #137, #138, #140, #144, #145)

### Removed

- CodeQL code-scanning workflow. (#132)

## [0.6.0] - 2026-06-12

### Changed

- **Renamed package `@rarebit-one/luminality-ui` → `@luminalityai/ui`** after moving this repository to the `luminalityai` GitHub org. No API or behavior changes — update import specifiers and your `package.json` dependency accordingly.

## [0.5.0] - 2026-04-27

### Added

- `EmptyState` component — dashed-border placeholder with icon + heading + description + action slot, ported from `@sidekick-labs/ui` (#79)
- `Time` component, `TimezoneProvider`, and `useTimezone()` hook for consistent date/time rendering (#79)
  - Resolution order: explicit `timezone` prop → `TimezoneProvider` context → browser tz → `"UTC"`
  - Supports `date`, `datetime`, `datetime-tz`, and `relative` format variants
  - Framework-agnostic — consumers wire up their own timezone source (Inertia shared props, user setting, etc.)
- Storybook stories for all components, with Playwright visual regression suite (#80, #81)
- Unit tests for `cn()` utility and axe-based a11y assertions (#80)
- Expanded `format-date` test coverage (boundary cases, abbreviation, fake-timers) (#79)

### Fixed

- All react-doctor warnings cleared (100/100 score) (#78)
- ESLint 10 compatibility: replaced `eslint-plugin-react` with `@eslint-react` (#69)

### Security

- Hardened all GitHub Actions workflows with pinned versions and minimal permissions (#75)

## [0.4.1] - 2026-04-07

### Fixed

- Dialog and modal visibility when using `tailwindcss-animate` plugin (#64)

### Changed

- Bumped Vite from 8.0.3 to 8.0.5 (#62)
- Fixed publish workflow action versions (#61)

## [0.4.0] - 2026-04-02

### Added

- `PlatformSwitcher` component for consistent sidebar headers across apps (#58)
  - Composes `DropdownMenu` + `Avatar` for cross-app linking and org switching
  - Supports `interactive` prop for static mode (no dropdown)
  - Optional `className` prop for consumer style overrides
  - Documents `--color-primary` CSS variable dependency

## [0.3.0] - 2026-03-25

### Added

- Storybook for component development and documentation (#51)
- New components: AspectRatio, Avatar, Collapsible, HoverCard, NavigationMenu, Popover, RadioGroup, ScrollArea, Separator, Slider, Switch, Tabs, Toggle, ToggleGroup, Tooltip (#51)
- `useControllableState` and `useCallbackRef` hooks (#51)
- Slot/Slottable primitives for component composition (#51)

### Changed

- Migrated build from `tsup` to Vite with `vite-plugin-dts` for better tree-shaking and DTS bundling (#51)
- Restructured component exports with individual component directories (#51)
- Upgraded Vite to v8 and `@vitejs/plugin-react` to v6 (#50)

### Fixed

- Build attestation made optional in publish workflow (#53)

## [0.2.0] - 2026-02-16

### Added

- Comprehensive component smoke tests and stricter TypeScript config (#8, #9)
- Sandbox playground for visual component development (#18)
- Full UI component library: Accordion, Badge, Breadcrumb, Calendar, Checkbox, Command, DatePicker, Drawer, DropdownMenu, Form, Input, Label, Menubar, Pagination, Progress, Select, Sheet, Sidebar, Skeleton, Sonner, Table, Textarea (#9)
- `cn()` utility, design tokens, and barrel exports (#1)
- GitHub Actions CI and publish workflows (#3)
- Publish workflow with dry-run mode, version consistency check, and build provenance (#10)
- ESLint configuration and `prepack` safety net (#6)
- Devcontainer for Node.js development (#5)

### Fixed

- Button base styles no longer force uppercase (#2)
- Accordion animations deduplicated with tw-animate-css (#4)
- Devcontainer Podman compatibility (#7)

## [0.1.0] - 2026-02-06

### Added

- Initial package scaffold for `@luminalityai/ui`
- Core UI components: Button, Card, Dialog, AlertDialog (#2)
- Design tokens and `cn()` utility (#1)

[Unreleased]: https://github.com/luminalityai/luminality-ui/compare/v0.9.0...HEAD
[0.9.0]: https://github.com/luminalityai/luminality-ui/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/luminalityai/luminality-ui/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/luminalityai/luminality-ui/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/luminalityai/luminality-ui/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/luminalityai/luminality-ui/compare/v0.4.1...v0.5.0
[0.4.1]: https://github.com/luminalityai/luminality-ui/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/luminalityai/luminality-ui/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/luminalityai/luminality-ui/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/luminalityai/luminality-ui/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/luminalityai/luminality-ui/releases/tag/v0.1.0
