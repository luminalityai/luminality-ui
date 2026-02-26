import { useState } from "react"
import { Callout } from "@rarebit-one/luminality-ui"
import { Section } from "../../components/section"
import { SelectControl, TextControl, ToggleControl } from "../../components/prop-control"

const variants = ["info", "warning", "success", "danger", "note"] as const

export function CalloutPage() {
  const [variant, setVariant] = useState<typeof variants[number]>("info")
  const [title, setTitle] = useState("Heads up")
  const [showTitle, setShowTitle] = useState(true)

  return (
    <>
      <h1 className="text-2xl font-bold text-[var(--color-text)]">Callout</h1>
      <p className="text-[var(--color-text-muted)]">Highlighted message with contextual icon.</p>

      <Section title="Interactive Preview">
        <div className="grid grid-cols-[240px_1fr] gap-8">
          <div className="space-y-3">
            <SelectControl label="Variant" value={variant} options={[...variants]} onChange={setVariant} />
            <ToggleControl label="Show Title" checked={showTitle} onChange={setShowTitle} />
            {showTitle && <TextControl label="Title" value={title} onChange={setTitle} />}
          </div>
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-8">
            <Callout
              variant={variant}
              title={showTitle ? title : undefined}
            >
              This is a {variant} callout with important information for the user.
            </Callout>
          </div>
        </div>
      </Section>

      <Section title="All Variants">
        <div className="space-y-3">
          {variants.map((v) => (
            <Callout key={v} variant={v} title={v.charAt(0).toUpperCase() + v.slice(1)}>
              This is a {v} callout. It communicates {v === "info" ? "helpful context" : v === "warning" ? "a potential issue" : v === "success" ? "a positive outcome" : v === "danger" ? "a critical error" : "an additional note"}.
            </Callout>
          ))}
        </div>
      </Section>

      <Section title="Usage">
        <pre className="p-4 rounded-[var(--radius-md)] bg-[var(--color-muted)] text-sm overflow-x-auto">
{`import { Callout } from "@rarebit-one/luminality-ui"

<Callout variant="warning" title="Warning">
  Please review before proceeding.
</Callout>`}
        </pre>
      </Section>
    </>
  )
}
