import type { ReactNode } from "react"

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-[var(--color-text)] border-b border-[var(--color-border)] pb-2">
        {title}
      </h2>
      <div className="space-y-6">{children}</div>
    </section>
  )
}
