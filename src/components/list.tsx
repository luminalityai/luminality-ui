import * as React from "react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/separator"

const List = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={className}
      {...props}
    />
  )
)
List.displayName = "List"

const ListSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string
    collapsible?: boolean
    defaultOpen?: boolean
  }
>(({ className, title, children, collapsible = false, defaultOpen = true, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  if (collapsible) {
    return (
      <div ref={ref} {...props}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="flex w-full items-center py-3 text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-text-secondary)] cursor-pointer uppercase"
        >
          <span>{title}</span>
          <Separator orientation="horizontal" dashed className="flex-1 mx-3" />
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
          >
            <path
              d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {isOpen && <div className="pb-3 space-y-1">{children}</div>}
      </div>
    )
  }

  return (
    <div ref={ref} className={cn("border-b border-[var(--color-border)] last:border-0 py-3", className)} {...props}>
      {title && <h4 className="text-sm font-medium text-[var(--color-text)] mb-2">{title}</h4>}
      <div className="space-y-1">{children}</div>
    </div>
  )
})
ListSection.displayName = "ListSection"

const ListItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    icon?: React.ReactNode
    prefix?: React.ReactNode
    suffix?: React.ReactNode
    active?: boolean
    actions?: Array<{
      icon: React.ReactNode
      label: string
      onClick?: () => void
    }>
  }
>(({ className, icon, prefix, suffix, active, actions = [], children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "group relative flex items-center gap-3 px-3 py-3 text-sm transition-colors border-b border-dashed border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-hover)]",
      active && "bg-[var(--color-surface-hover)]",
      className
    )}
    {...props}
  >
    {prefix && <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-muted)] text-[var(--color-text)] font-medium text-xs">{prefix}</div>}
    {icon && <div className="text-[var(--color-text-muted)]">{icon}</div>}
    {children}
    {suffix && <div className="text-[var(--color-text-muted)]">{suffix}</div>}

    {actions.length > 0 && (
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
        {actions.map((action, index) => (
          <button
            type="button"
            key={index}
            onClick={action.onClick}
            className="w-14 h-14 flex flex-col items-center justify-center gap-1 p-2.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
            title={action.label}
            aria-label={action.label}
          >
            <div className="w-4 h-4">
              {action.icon}
            </div>
            <span className="text-[10px] uppercase font-medium leading-none">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    )}
  </div>
))
ListItem.displayName = "ListItem"

const ListItemTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("font-medium text-[var(--color-text)] truncate", className)}
      {...props}
    />
  )
)
ListItemTitle.displayName = "ListItemTitle"

const ListItemDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-xs text-[var(--color-text-muted)] truncate", className)}
      {...props}
    />
  )
)
ListItemDescription.displayName = "ListItemDescription"

const ListItemMeta = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-2 text-xs text-[var(--color-text-muted)]", className)}
      {...props}
    />
  )
)
ListItemMeta.displayName = "ListItemMeta"

export { List, ListSection, ListItem, ListItemTitle, ListItemDescription, ListItemMeta }
