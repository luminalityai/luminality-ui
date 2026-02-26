import { useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@rarebit-one/luminality-ui"
import { Section } from "../../components/section"
import { TextControl } from "../../components/prop-control"

export function AvatarPage() {
  const [initials, setInitials] = useState("JD")

  return (
    <>
      <h1 className="text-2xl font-bold text-[var(--color-text)]">Avatar</h1>
      <p className="text-[var(--color-text-muted)]">Circular image or fallback initials for user representation.</p>

      <Section title="Interactive Preview">
        <div className="grid grid-cols-[240px_1fr] gap-8">
          <div className="space-y-3">
            <TextControl label="Initials" value={initials} onChange={setInitials} />
          </div>
          <div className="flex items-center justify-center gap-4 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-8 min-h-[120px]">
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </Section>

      <Section title="Sizes">
        <div className="flex items-end gap-4">
          <div className="text-center space-y-2">
            <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">XS</AvatarFallback></Avatar>
            <p className="text-xs text-[var(--color-text-muted)]">24px</p>
          </div>
          <div className="text-center space-y-2">
            <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">SM</AvatarFallback></Avatar>
            <p className="text-xs text-[var(--color-text-muted)]">32px</p>
          </div>
          <div className="text-center space-y-2">
            <Avatar><AvatarFallback>MD</AvatarFallback></Avatar>
            <p className="text-xs text-[var(--color-text-muted)]">40px (default)</p>
          </div>
          <div className="text-center space-y-2">
            <Avatar className="h-14 w-14"><AvatarFallback className="text-lg">LG</AvatarFallback></Avatar>
            <p className="text-xs text-[var(--color-text-muted)]">56px</p>
          </div>
          <div className="text-center space-y-2">
            <Avatar className="h-20 w-20"><AvatarFallback className="text-2xl">XL</AvatarFallback></Avatar>
            <p className="text-xs text-[var(--color-text-muted)]">80px</p>
          </div>
        </div>
      </Section>

      <Section title="With Image">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/80?u=1" alt="User 1" />
            <AvatarFallback>U1</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/80?u=2" alt="User 2" />
            <AvatarFallback>U2</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://invalid-url" alt="Fallback" />
            <AvatarFallback>FB</AvatarFallback>
          </Avatar>
        </div>
      </Section>

      <Section title="Usage">
        <pre className="p-4 rounded-[var(--radius-md)] bg-[var(--color-muted)] text-sm overflow-x-auto">
{`import { Avatar, AvatarImage, AvatarFallback } from "@rarebit-one/luminality-ui"

<Avatar>
  <AvatarImage src="/photo.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>`}
        </pre>
      </Section>
    </>
  )
}
