import { useState } from "react"
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from "@lib/components/card"
import { Button } from "@lib/components/button"
import { Section } from "../../components/section"
import { SelectControl, ToggleControl, TextControl } from "../../components/prop-control"

const paddings = ["sm", "md", "lg"] as const

export function CardPage() {
  const [padding, setPadding] = useState<typeof paddings[number]>("md")
  const [showFooter, setShowFooter] = useState(true)
  const [title, setTitle] = useState("Card Title")

  return (
    <>
      <h1 className="text-2xl font-bold text-[var(--color-text)]">Card</h1>
      <p className="text-[var(--color-text-muted)]">Container for grouping related content.</p>

      <Section title="Interactive Preview">
        <div className="grid grid-cols-[240px_1fr] gap-8">
          <div className="space-y-3">
            <SelectControl label="Padding" value={padding} options={[...paddings]} onChange={setPadding} />
            <ToggleControl label="Show Footer" checked={showFooter} onChange={setShowFooter} />
            <TextControl label="Title" value={title} onChange={setTitle} />
          </div>
          <div className="flex items-start justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-8">
            <Card className="w-full max-w-sm">
              <CardHeader padding={padding}>
                <CardTitle>{title}</CardTitle>
                <CardDescription>A card description goes here.</CardDescription>
              </CardHeader>
              <CardContent padding={padding}>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Card body content with some example text.
                </p>
              </CardContent>
              {showFooter && (
                <CardFooter padding={padding}>
                  <Button size="sm">Action</Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </Section>

      <Section title="Padding Sizes">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {paddings.map((p) => (
            <Card key={p}>
              <CardHeader padding={p}>
                <CardTitle>{p} padding</CardTitle>
                <CardDescription>padding="{p}"</CardDescription>
              </CardHeader>
              <CardContent padding={p}>
                <p className="text-sm text-[var(--color-text-secondary)]">Content area.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Usage">
        <pre className="p-4 rounded-[var(--radius-md)] bg-[var(--color-muted)] text-sm overflow-x-auto">
{`import { Card, CardHeader, CardTitle, CardContent } from "@rarebit-one/luminality-ui"

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>`}
        </pre>
      </Section>
    </>
  )
}
