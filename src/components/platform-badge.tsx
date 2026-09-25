import * as React from "react"

// This module is deliberately dependency-free (React only). It is meant to sit
// in a consumer's always-loaded shell (e.g. a sidebar), so everything it
// imports lands on that app's initial load:
//
//  - it must not import the dropdown menu — that is the whole point of it
//    existing separately from `PlatformSwitcher`;
//  - it does not use `cn()`, because `cn()` pulls in `tailwind-merge`, which
//    measured +8.8 kB gzip on luminality-web's initial load — more than the
//    rest of the tile by two orders of magnitude. `className` is therefore
//    appended, not merged (see the prop docs).
//
// `src/test/bundle/platform-badge.treeshake.test.ts` guards both.

export interface PlatformBadgeProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  // `aria-label` / `aria-labelledby` are omitted so a caller cannot silently
  // replace the `label`-based accessible name.
  "children" | "role" | "aria-label" | "aria-labelledby"
> {
  // TypeScript accepts any hyphenated JSX attribute that is not declared, so
  // `Omit` alone would not reject `<PlatformBadge aria-label="…" />`.
  // Declaring them as `never` makes that a type error.
  /** Not supported — the accessible name is always `label`. */
  "aria-label"?: never
  /** Not supported — the accessible name is always `label`. */
  "aria-labelledby"?: never
  /**
   * App brand icon (ReactNode, e.g. an SVG or lucide icon). Rendered inside a
   * square tile filled with `--color-primary`. The tile is exposed as a single
   * image, so the icon itself is never announced separately.
   */
  icon: React.ReactNode
  /** App name — the tile's accessible name */
  label: string
  /**
   * Extra classes, **appended** to the tile's own (not merged with
   * `tailwind-merge`), so a conflicting utility such as `bg-*` is not
   * guaranteed to win. To recolour the tile, set `--color-primary` /
   * `--color-primary-foreground` on it instead (e.g. via `style`).
   */
  className?: string
}

const TILE_CLASSES =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"

/**
 * Static, non-interactive app brand tile — the visual of `PlatformSwitcher`
 * without the menu. Renders an `img`-role element (not a button), so it is not
 * focusable and does not bundle the dropdown code.
 */
const PlatformBadge = React.forwardRef<HTMLDivElement, PlatformBadgeProps>(
  ({ icon, label, className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      role="img"
      aria-label={label}
      aria-labelledby={undefined}
      className={className ? `${TILE_CLASSES} ${className}` : TILE_CLASSES}
    >
      {icon}
    </div>
  ),
)
PlatformBadge.displayName = "PlatformBadge"

export { PlatformBadge }
