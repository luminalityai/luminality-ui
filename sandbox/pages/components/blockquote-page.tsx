import { useState } from "react"
import { Blockquote } from "@rarebit-one/luminality-ui"
import { Section } from "../../components/section"
import { TextControl, ToggleControl } from "../../components/prop-control"

export function BlockquotePage() {
  const [author, setAuthor] = useState("Marcus Aurelius")
  const [source, setSource] = useState("Meditations")
  const [showAuthor, setShowAuthor] = useState(true)
  const [showSource, setShowSource] = useState(true)

  return (
    <>
      <h1 className="text-2xl font-bold text-[var(--color-text)]">Blockquote</h1>
      <p className="text-[var(--color-text-muted)]">Styled quotation with optional attribution.</p>

      <Section title="Interactive Preview">
        <div className="grid grid-cols-[240px_1fr] gap-8">
          <div className="space-y-3">
            <ToggleControl label="Show Author" checked={showAuthor} onChange={setShowAuthor} />
            {showAuthor && <TextControl label="Author" value={author} onChange={setAuthor} />}
            <ToggleControl label="Show Source" checked={showSource} onChange={setShowSource} />
            {showSource && <TextControl label="Source" value={source} onChange={setSource} />}
          </div>
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-8">
            <Blockquote
              author={showAuthor ? author : undefined}
              source={showSource ? source : undefined}
            >
              The happiness of your life depends upon the quality of your thoughts.
            </Blockquote>
          </div>
        </div>
      </Section>

      <Section title="Variations">
        <div className="space-y-6">
          <Blockquote>
            A quote without attribution.
          </Blockquote>
          <Blockquote author="Lao Tzu">
            The journey of a thousand miles begins with a single step.
          </Blockquote>
          <Blockquote author="Seneca" source="Letters from a Stoic">
            We suffer more often in imagination than in reality.
          </Blockquote>
        </div>
      </Section>

      <Section title="Usage">
        <pre className="p-4 rounded-[var(--radius-md)] bg-[var(--color-muted)] text-sm overflow-x-auto">
{`import { Blockquote } from "@rarebit-one/luminality-ui"

<Blockquote author="Author" source="Book">
  Quote text here.
</Blockquote>`}
        </pre>
      </Section>
    </>
  )
}
