import { useState } from "react"
import { Separator } from "@rarebit-one/luminality-ui"
import { Section } from "../../components/section"
import { SelectControl, ToggleControl } from "../../components/prop-control"

const orientations = ["horizontal", "vertical"] as const

export function SeparatorPage() {
  const [orientation, setOrientation] = useState<typeof orientations[number]>("horizontal")
  const [dashed, setDashed] = useState(false)

  return (
    <>
      <h1 className="text-2xl font-bold text-[var(--color-text)]">Separator</h1>
      <p className="text-[var(--color-text-muted)]">Visual divider between content sections.</p>

      <Section title="Interactive Preview">
        <div className="grid grid-cols-[240px_1fr] gap-8">
          <div className="space-y-3">
            <SelectControl label="Orientation" value={orientation} options={[...orientations]} onChange={setOrientation} />
            <ToggleControl label="Dashed" checked={dashed} onChange={setDashed} />
          </div>
          <div className="flex items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-8 min-h-[120px]">
            {orientation === "horizontal" ? (
              <div className="w-full space-y-4">
                <p className="text-sm text-[var(--color-text-secondary)]">Content above</p>
                <Separator dashed={dashed} />
                <p className="text-sm text-[var(--color-text-secondary)]">Content below</p>
              </div>
            ) : (
              <div className="flex items-center gap-4 h-16">
                <span className="text-sm text-[var(--color-text-secondary)]">Left</span>
                <Separator orientation="vertical" dashed={dashed} />
                <span className="text-sm text-[var(--color-text-secondary)]">Right</span>
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section title="All Combinations">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[var(--color-text)]">Horizontal — solid</p>
            <Separator />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-[var(--color-text)]">Horizontal — dashed</p>
            <Separator dashed />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-[var(--color-text)]">Vertical</p>
            <div className="flex items-center gap-4 h-12">
              <span className="text-sm">A</span>
              <Separator orientation="vertical" />
              <span className="text-sm">B</span>
              <Separator orientation="vertical" dashed />
              <span className="text-sm">C</span>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Usage">
        <pre className="p-4 rounded-[var(--radius-md)] bg-[var(--color-muted)] text-sm overflow-x-auto">
{`import { Separator } from "@rarebit-one/luminality-ui"

<Separator />
<Separator dashed />
<Separator orientation="vertical" />`}
        </pre>
      </Section>
    </>
  )
}
