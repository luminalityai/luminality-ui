import { useState, useEffect } from "react"
import { pages, getGroupedPages } from "./pages"
import { ThemeToggle } from "./components/theme-toggle"

function getHash() {
  return window.location.hash.replace("#", "") || "kitchen-sink"
}

export function App() {
  const [route, setRoute] = useState(getHash)

  useEffect(() => {
    const onHashChange = () => setRoute(getHash())
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  const currentPage = pages[route] || pages["kitchen-sink"]
  const Component = currentPage.component
  const grouped = getGroupedPages()

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col overflow-y-auto">
        <div className="px-4 py-4 border-b border-[var(--color-border)]">
          <h1 className="text-sm font-semibold text-[var(--color-text)] tracking-wide uppercase">
            Luminality UI
          </h1>
          <div className="mt-2">
            <ThemeToggle />
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-4">
          <a
            href="#kitchen-sink"
            className={`block px-3 py-1.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors ${
              route === "kitchen-sink"
                ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                : "text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]"
            }`}
          >
            Kitchen Sink
          </a>

          {grouped.map(({ category, items }) => (
            <div key={category}>
              <h3 className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                {category}
              </h3>
              {items.map(({ key, label }) => (
                <a
                  key={key}
                  href={`#${key}`}
                  className={`block px-3 py-1.5 rounded-[var(--radius-md)] text-sm transition-colors ${
                    route === key
                      ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {label}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <Component />
        </div>
      </main>
    </div>
  )
}
