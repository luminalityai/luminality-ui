import { useState } from "react"
import { Checkbox } from "@lib/components/checkbox"
import { Section } from "../../components/section"
import { ToggleControl } from "../../components/prop-control"

export function CheckboxPage() {
  const [checked, setChecked] = useState(false)
  const [disabled, setDisabled] = useState(false)

  return (
    <>
      <h1 className="text-2xl font-bold text-[var(--color-text)]">Checkbox</h1>
      <p className="text-[var(--color-text-muted)]">A control that allows toggling between checked and unchecked.</p>

      <Section title="Interactive Preview">
        <div className="grid grid-cols-[240px_1fr] gap-8">
          <div className="space-y-3">
            <ToggleControl label="Checked" checked={checked} onChange={setChecked} />
            <ToggleControl label="Disabled" checked={disabled} onChange={setDisabled} />
          </div>
          <div className="flex items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-8 min-h-[120px]">
            <Checkbox
              id="preview-cb"
              checked={checked}
              onCheckedChange={(c) => setChecked(c === true)}
              disabled={disabled}
            />
            <label htmlFor="preview-cb" className="text-sm text-[var(--color-text)]">
              Accept terms and conditions
            </label>
          </div>
        </div>
      </Section>

      <Section title="States">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Checkbox id="cb-unchecked" />
            <label htmlFor="cb-unchecked" className="text-sm text-[var(--color-text)]">Unchecked</label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="cb-checked" defaultChecked />
            <label htmlFor="cb-checked" className="text-sm text-[var(--color-text)]">Checked</label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="cb-disabled" disabled />
            <label htmlFor="cb-disabled" className="text-sm text-[var(--color-text)] opacity-50">Disabled</label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="cb-disabled-checked" disabled defaultChecked />
            <label htmlFor="cb-disabled-checked" className="text-sm text-[var(--color-text)] opacity-50">Disabled + Checked</label>
          </div>
        </div>
      </Section>

      <Section title="Usage">
        <pre className="p-4 rounded-[var(--radius-md)] bg-[var(--color-muted)] text-sm overflow-x-auto">
{`import { Checkbox } from "@rarebit-one/luminality-ui"

<Checkbox
  checked={checked}
  onCheckedChange={(c) => setChecked(c === true)}
/>`}
        </pre>
      </Section>
    </>
  )
}
