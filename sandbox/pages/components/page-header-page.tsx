import { useState } from "react"
import { PageHeader, Button } from "@rarebit-one/luminality-ui"
import { Section } from "../../components/section"
import { ToggleControl, TextControl } from "../../components/prop-control"

export function PageHeaderPage() {
  const [showBreadcrumbs, setShowBreadcrumbs] = useState(true)
  const [showActions, setShowActions] = useState(true)
  const [showBack, setShowBack] = useState(false)
  const [title, setTitle] = useState("Page Title")

  return (
    <>
      <h1 className="text-2xl font-bold text-[var(--color-text)]">PageHeader</h1>
      <p className="text-[var(--color-text-muted)]">Top-of-page header with breadcrumbs, title, and actions.</p>

      <Section title="Interactive Preview">
        <div className="grid grid-cols-[240px_1fr] gap-8">
          <div className="space-y-3">
            <ToggleControl label="Breadcrumbs" checked={showBreadcrumbs} onChange={setShowBreadcrumbs} />
            <ToggleControl label="Actions" checked={showActions} onChange={setShowActions} />
            <ToggleControl label="Back button" checked={showBack} onChange={setShowBack} />
            {!showBreadcrumbs && <TextControl label="Title" value={title} onChange={setTitle} />}
          </div>
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] overflow-hidden">
            <PageHeader
              title={showBreadcrumbs ? undefined : title}
              breadcrumbs={showBreadcrumbs ? [
                { label: "Home", href: "#" },
                { label: "Settings", href: "#" },
                { label: "Profile" },
              ] : undefined}
              actions={showActions ? <Button size="sm">Save</Button> : undefined}
              showBackButton={showBack}
              onBackClick={() => {}}
            />
          </div>
        </div>
      </Section>

      <Section title="Variations">
        <div className="space-y-4">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
            <PageHeader title="Simple Title" />
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
            <PageHeader
              breadcrumbs={[{ label: "Dashboard", href: "#" }, { label: "Users" }]}
              actions={
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">Cancel</Button>
                  <Button size="sm">Save</Button>
                </div>
              }
            />
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
            <PageHeader
              title="With Back Button"
              showBackButton
              onBackClick={() => {}}
            />
          </div>
        </div>
      </Section>

      <Section title="Usage">
        <pre className="p-4 rounded-[var(--radius-md)] bg-[var(--color-muted)] text-sm overflow-x-auto">
{`import { PageHeader } from "@rarebit-one/luminality-ui"

<PageHeader
  breadcrumbs={[
    { label: "Home", href: "/" },
    { label: "Current Page" },
  ]}
  actions={<Button size="sm">Save</Button>}
/>`}
        </pre>
      </Section>
    </>
  )
}
