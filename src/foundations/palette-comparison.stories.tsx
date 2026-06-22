import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "../components/button"
import { Status } from "../components/status"
import { Badge } from "../components/badge"

/**
 * Side-by-side review aid for the WCAG-AA palette change (PR #143).
 *
 * Left column = the current published brand palette; right column = the
 * proposed darkened palette. Each column overrides the design-token CSS
 * variables inline, so the real components below render under that palette.
 * Contrast ratios are computed live (color vs white) — the WCAG AA bar is
 * 4.5:1 for normal text / UI text on a fill.
 *
 * This story deliberately renders the current (failing-contrast) palette, so it
 * opts out of the enforced a11y test.
 */

type Token = {
  label: string
  cssVar: string
  hoverVar?: string
  current: string
  currentHover?: string
  proposed: string
  proposedHover?: string
  usage: string
}

const TOKENS: Token[] = [
  {
    label: "Primary",
    cssVar: "--color-primary",
    hoverVar: "--color-primary-hover",
    current: "#d94563",
    currentHover: "#c93555",
    proposed: "#c5274a",
    proposedHover: "#b21f3f",
    usage: "Primary buttons, links",
  },
  {
    label: "Accent",
    cssVar: "--color-accent",
    hoverVar: "--color-accent-hover",
    current: "#f59e0b",
    currentHover: "#d97706",
    proposed: "#b45309",
    proposedHover: "#92400e",
    usage: "Accent buttons, highlights",
  },
  {
    label: "Info",
    cssVar: "--color-info",
    hoverVar: "--color-info-hover",
    current: "#06b6d4",
    currentHover: "#0891b2",
    proposed: "#0e7490",
    proposedHover: "#0c627a",
    usage: "Info status, online",
  },
  {
    label: "Success",
    cssVar: "--color-success",
    hoverVar: "--color-success-hover",
    current: "#22c55e",
    currentHover: "#16a34a",
    proposed: "#15803d",
    proposedHover: "#116532",
    usage: "Success buttons, status",
  },
  {
    label: "Danger",
    cssVar: "--color-danger",
    hoverVar: "--color-danger-hover",
    current: "#ef4444",
    currentHover: "#dc2626",
    proposed: "#d32f2f",
    proposedHover: "#b71c1c",
    usage: "Destructive actions, failed",
  },
  {
    label: "Text muted",
    cssVar: "--color-text-muted",
    current: "#9a8f7f",
    proposed: "#78705f",
    usage: "Secondary / muted text",
  },
  {
    label: "Warning (as text)",
    cssVar: "--color-warning-text",
    current: "#fcd34d",
    proposed: "#946c00",
    usage: "Status “processing” text",
  },
]

// WCAG relative luminance + contrast ratio (vs white) — computed live so the
// numbers are self-verifying, not hand-typed.
function luminance(hex: string): number {
  const n = parseInt(hex.replace("#", ""), 16)
  const srgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
}

function contrastVsWhite(hex: string): number {
  const L = luminance(hex)
  return (1.0 + 0.05) / (L + 0.05)
}

function RatioBadge({ hex }: { hex: string }) {
  const ratio = contrastVsWhite(hex)
  const pass = ratio >= 4.5
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 999,
        color: pass ? "#15803d" : "#b71c1c",
        background: pass ? "#dcfce7" : "#fee2e2",
        whiteSpace: "nowrap",
      }}
      title="Contrast ratio vs white (WCAG AA needs ≥ 4.5:1)"
    >
      {ratio.toFixed(2)}:1 {pass ? "AA ✓" : "✗"}
    </span>
  )
}

function Swatch({ hex }: { hex: string }) {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 8,
        background: hex,
        border: "1px solid rgba(0,0,0,0.12)",
        flexShrink: 0,
      }}
    />
  )
}

// Build the CSS-variable override map for a column from a token-value picker.
function paletteVars(
  pick: (t: Token) => { value: string; hover?: string },
): React.CSSProperties {
  const vars: Record<string, string> = {}
  for (const t of TOKENS) {
    const { value, hover } = pick(t)
    vars[t.cssVar] = value
    if (t.hoverVar && hover) vars[t.hoverVar] = hover
  }
  return vars as React.CSSProperties
}

const currentVars = paletteVars((t) => ({
  value: t.current,
  hover: t.currentHover,
}))
const proposedVars = paletteVars((t) => ({
  value: t.proposed,
  hover: t.proposedHover,
}))

function SwatchColumn({ pick }: { pick: (t: Token) => string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {TOKENS.map((t) => {
        const hex = pick(t)
        return (
          <div
            key={t.label}
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <Swatch hex={hex} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minWidth: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <strong style={{ fontSize: 14 }}>{t.label}</strong>
                <code style={{ fontSize: 12, color: "#6b5b45" }}>{hex}</code>
                <RatioBadge hex={hex} />
              </div>
              <span style={{ fontSize: 12, color: "#6b5b45" }}>{t.usage}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Real components, rendered under whatever palette the wrapping column sets.
function ComponentSamples() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <Button variant="primary">Primary</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="info">Info</Button>
        <Button variant="success">Success</Button>
        <Button variant="danger">Danger</Button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <Status variant="active">Active</Status>
        <Status variant="online">Online</Status>
        <Status variant="failed">Failed</Status>
        <Status variant="processing">Processing</Status>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="danger">Danger</Badge>
      </div>
    </div>
  )
}

function Column({
  title,
  subtitle,
  vars,
  pick,
}: {
  title: string
  subtitle: string
  vars: React.CSSProperties
  pick: (t: Token) => string
}) {
  return (
    <div
      style={{
        flex: "1 1 0",
        minWidth: 320,
        border: "1px solid #e8e2d1",
        borderRadius: 12,
        padding: 20,
        background: "#ffffff",
      }}
    >
      <h3 style={{ margin: "0 0 2px", fontSize: 16 }}>{title}</h3>
      <p style={{ margin: "0 0 16px", fontSize: 13, color: "#6b5b45" }}>
        {subtitle}
      </p>
      <SwatchColumn pick={pick} />
      <hr
        style={{ margin: "20px 0", border: 0, borderTop: "1px solid #efe9dc" }}
      />
      {/* The inline CSS-var overrides make the real components below adopt this
          column's palette. */}
      <div style={vars}>
        <ComponentSamples />
      </div>
    </div>
  )
}

const meta: Meta = {
  title: "Foundations/Palette comparison (WCAG AA)",
  parameters: {
    layout: "fullscreen",
    // This story intentionally renders the current, low-contrast palette for
    // comparison, so skip the enforced a11y test for it.
    a11y: { test: "off" },
  },
}
export default meta
type Story = StoryObj

export const CurrentVsProposed: Story = {
  name: "Current vs proposed",
  render: () => (
    <div style={{ padding: 24 }}>
      <h2 style={{ margin: "0 0 4px" }}>Brand palette — current vs proposed</h2>
      <p
        style={{
          margin: "0 0 20px",
          fontSize: 14,
          color: "#6b5b45",
          maxWidth: 720,
        }}
      >
        The proposed palette darkens six brand tokens so white text on fills
        (and muted text on white) clears WCAG AA (4.5:1). Hue is preserved.
        Ratios below are computed live (colour vs white). Compare the swatches
        and the real components rendered under each palette.
      </p>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <Column
          title="Current"
          subtitle="Shipping today — several tokens fail AA"
          vars={currentVars}
          pick={(t) => t.current}
        />
        <Column
          title="Proposed (WCAG AA)"
          subtitle="PR #143 — all tokens pass AA"
          vars={proposedVars}
          pick={(t) => t.proposed}
        />
      </div>
    </div>
  ),
}
