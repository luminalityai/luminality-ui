# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

- Initial package scaffold for `@rarebit-one/luminality-ui`
- Core UI components: Button, Card, Dialog, AlertDialog (#2)
- Design tokens and `cn()` utility (#1)

[Unreleased]: https://github.com/rarebit-one/luminality-ui/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/rarebit-one/luminality-ui/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/rarebit-one/luminality-ui/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/rarebit-one/luminality-ui/releases/tag/v0.1.0
