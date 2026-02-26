import { useState } from "react"
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@rarebit-one/luminality-ui"
import { Section } from "../../components/section"
import { SelectControl, ToggleControl } from "../../components/prop-control"

export function AccordionPage() {
  const [type, setType] = useState<"single" | "multiple">("single")
  const [collapsible, setCollapsible] = useState(true)

  return (
    <>
      <h1 className="text-2xl font-bold text-[var(--color-text)]">Accordion</h1>
      <p className="text-[var(--color-text-muted)]">Vertically stacked set of interactive headings that reveal content.</p>

      <Section title="Interactive Preview">
        <div className="grid grid-cols-[240px_1fr] gap-8">
          <div className="space-y-3">
            <SelectControl label="Type" value={type} options={["single", "multiple"]} onChange={setType} />
            {type === "single" && (
              <ToggleControl label="Collapsible" checked={collapsible} onChange={setCollapsible} />
            )}
          </div>
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-8">
            {type === "single" ? (
              <Accordion type="single" collapsible={collapsible}>
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is this component?</AccordionTrigger>
                  <AccordionContent>
                    An accordion is a vertically stacked set of interactive headings that each reveal a section of content.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is it accessible?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern and is built on Radix UI primitives.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Can I customize it?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It supports custom styling via className props on all sub-components.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <Accordion type="multiple">
                <AccordionItem value="item-1">
                  <AccordionTrigger>First item</AccordionTrigger>
                  <AccordionContent>Multiple items can be open at once.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Second item</AccordionTrigger>
                  <AccordionContent>Try opening this while the first is open.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Third item</AccordionTrigger>
                  <AccordionContent>All three can be expanded simultaneously.</AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        </div>
      </Section>

      <Section title="Usage">
        <pre className="p-4 rounded-[var(--radius-md)] bg-[var(--color-muted)] text-sm overflow-x-auto">
{`import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@rarebit-one/luminality-ui"

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section title</AccordionTrigger>
    <AccordionContent>Section content</AccordionContent>
  </AccordionItem>
</Accordion>`}
        </pre>
      </Section>
    </>
  )
}
