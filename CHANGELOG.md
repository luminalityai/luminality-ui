# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/luminalityai/luminality-ui/compare/v0.6.0...HEAD
[0.6.0]: https://github.com/luminalityai/luminality-ui/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/luminalityai/luminality-ui/compare/v0.4.1...v0.5.0
[0.4.1]: https://github.com/luminalityai/luminality-ui/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/luminalityai/luminality-ui/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/luminalityai/luminality-ui/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/luminalityai/luminality-ui/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/luminalityai/luminality-ui/releases/tag/v0.1.0
