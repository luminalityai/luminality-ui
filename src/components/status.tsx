import * as React from "react"
import { cn } from "@/lib/utils"

export interface StatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "active"
    | "online"
    | "offline"
    | "completed"
    | "failed"
    | "cancelled"
    | "processing"
}

const Status = React.forwardRef<HTMLSpanElement, StatusProps>(
  ({ className, variant = "active", children, ...props }, ref) => {
    // Every variant here is a status FILL rendered as text. `processing`
    // already reads its ink sibling (--color-warning-text) because the amber
    // fill is unreadable as text; the rest resolve to the same value in this
    // package's own theme, where those fills do clear 4.5:1 on the surfaces
    // Status renders on (worst case: info 4.96:1, success 4.64:1, danger
    // 4.61:1, on --color-surface-hover).
    //
    // They still go through the `var(ink, fill)` indirection so a host that
    // ships its own palette — where the same fills may not clear as text — can
    // correct them by DEFINING the ink token, instead of overriding the
    // generated utilities with a CSS shim. Undefined ink = today's rendering.
    const variants = {
      active: "text-[var(--color-success-text,var(--color-success))]",
      online: "text-[var(--color-info-text,var(--color-info))]",
      offline: "text-[var(--color-text-muted)]",
      completed: "text-[var(--color-success-text,var(--color-success))]",
      failed: "text-[var(--color-danger-text,var(--color-danger))]",
      cancelled: "text-[var(--color-text-muted)]",
      processing: "text-[var(--color-warning-text)]",
    }

    return (
      <span
        ref={ref}
        className={cn(
          "text-xs font-medium uppercase tracking-wide",
          variants[variant],
          className,
        )}
        {...props}
      >
        {children}
      </span>
    )
  },
)
Status.displayName = "Status"

export { Status }
