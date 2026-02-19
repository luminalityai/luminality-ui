import { useState } from "react"
import { Button } from "@lib/components/button"
import { Section } from "../../components/section"
import { SelectControl, ToggleControl, TextControl } from "../../components/prop-control"

const variants = ["primary", "secondary", "accent", "info", "success", "danger", "warning", "ghost", "muted", "outline"] as const
const sizes = ["sm", "md", "lg"] as const

export function ButtonPage() {
  const [variant, setVariant] = useState<string>("primary")
  const [size, setSize] = useState<string>("md")
  const [disabled, setDisabled] = useState(false)
  const [label, setLabel] = useState("Click me")

  return (
    <>
      <h1 className="text-2xl font-bold text-[var(--color-text)]">Button</h1>
      <p className="text-[var(--color-text-muted)]">Triggers an action or event.</p>

      <Section title="Interactive Preview">
        <div className="grid grid-cols-[240px_1fr] gap-8">
          <div className="space-y-3">
            <SelectControl label="Variant" value={variant} options={[...variants]} onChange={setVariant} />
            <SelectControl label="Size" value={size} options={[...sizes]} onChange={setSize} />
            <ToggleControl label="Disabled" checked={disabled} onChange={setDisabled} />
            <TextControl label="Label" value={label} onChange={setLabel} />
          </div>
          <div className="flex items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-8 min-h-[120px]">
            <Button
              variant={variant as typeof variants[number]}
              size={size as typeof sizes[number]}
              disabled={disabled}
            >
              {label}
            </Button>
          </div>
        </div>
      </Section>

      <Section title="All Variants">
        <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 items-center">
          {variants.map((v) => (
            <>
              <span key={`label-${v}`} className="text-sm text-[var(--color-text-muted)] text-right">{v}</span>
              <div key={`buttons-${v}`} className="flex gap-2">
                {sizes.map((s) => (
                  <Button key={`${v}-${s}`} variant={v} size={s}>{s}</Button>
                ))}
                <Button variant={v} disabled>disabled</Button>
              </div>
            </>
          ))}
        </div>
      </Section>

      <Section title="Usage">
        <pre className="p-4 rounded-[var(--radius-md)] bg-[var(--color-muted)] text-sm overflow-x-auto">
{`import { Button } from "@rarebit-one/luminality-ui"

<Button variant="primary" size="md">
  Click me
</Button>`}
        </pre>
      </Section>
    </>
  )
}
