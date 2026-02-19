import { useState } from "react"
import { Badge } from "@lib/components/badge"
import { Section } from "../../components/section"
import { SelectControl, TextControl } from "../../components/prop-control"

const variants = ["primary", "secondary", "accent", "info", "success", "warning", "danger", "muted"] as const
const sizes = ["sm", "md"] as const

export function BadgePage() {
  const [variant, setVariant] = useState<string>("primary")
  const [size, setSize] = useState<string>("md")
  const [label, setLabel] = useState("Badge")

  return (
    <>
      <h1 className="text-2xl font-bold text-[var(--color-text)]">Badge</h1>
      <p className="text-[var(--color-text-muted)]">Small status descriptor for UI elements.</p>

      <Section title="Interactive Preview">
        <div className="grid grid-cols-[240px_1fr] gap-8">
          <div className="space-y-3">
            <SelectControl label="Variant" value={variant} options={[...variants]} onChange={setVariant} />
            <SelectControl label="Size" value={size} options={[...sizes]} onChange={setSize} />
            <TextControl label="Label" value={label} onChange={setLabel} />
          </div>
          <div className="flex items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-8 min-h-[120px]">
            <Badge
              variant={variant as typeof variants[number]}
              size={size as typeof sizes[number]}
            >
              {label}
            </Badge>
          </div>
        </div>
      </Section>

      <Section title="All Variants">
        <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 items-center">
          {variants.map((v) => (
            <>
              <span key={`label-${v}`} className="text-sm text-[var(--color-text-muted)] text-right">{v}</span>
              <div key={`badges-${v}`} className="flex gap-2">
                {sizes.map((s) => (
                  <Badge key={`${v}-${s}`} variant={v} size={s}>{s}</Badge>
                ))}
              </div>
            </>
          ))}
        </div>
      </Section>

      <Section title="Usage">
        <pre className="p-4 rounded-[var(--radius-md)] bg-[var(--color-muted)] text-sm overflow-x-auto">
{`import { Badge } from "@rarebit-one/luminality-ui"

<Badge variant="success" size="md">Active</Badge>`}
        </pre>
      </Section>
    </>
  )
}
