import { Fragment, useState } from "react"
import { Status } from "@rarebit-one/luminality-ui"
import { Section } from "../../components/section"
import { SelectControl, TextControl } from "../../components/prop-control"

const variants = ["active", "online", "offline", "completed", "failed", "cancelled", "processing"] as const

export function StatusPage() {
  const [variant, setVariant] = useState<typeof variants[number]>("active")
  const [label, setLabel] = useState("Active")

  return (
    <>
      <h1 className="text-2xl font-bold text-[var(--color-text)]">Status</h1>
      <p className="text-[var(--color-text-muted)]">Text-based status indicator.</p>

      <Section title="Interactive Preview">
        <div className="grid grid-cols-[240px_1fr] gap-8">
          <div className="space-y-3">
            <SelectControl label="Variant" value={variant} options={[...variants]} onChange={setVariant} />
            <TextControl label="Label" value={label} onChange={setLabel} />
          </div>
          <div className="flex items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-8 min-h-[120px]">
            <Status variant={variant}>{label}</Status>
          </div>
        </div>
      </Section>

      <Section title="All Variants">
        <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 items-center">
          {variants.map((v) => (
            <Fragment key={v}>
              <span className="text-sm text-[var(--color-text-muted)] text-right font-mono">{v}</span>
              <Status variant={v}>{v}</Status>
            </Fragment>
          ))}
        </div>
      </Section>

      <Section title="Usage">
        <pre className="p-4 rounded-[var(--radius-md)] bg-[var(--color-muted)] text-sm overflow-x-auto">
{`import { Status } from "@rarebit-one/luminality-ui"

<Status variant="active">Active</Status>`}
        </pre>
      </Section>
    </>
  )
}
