import * as React from "react"
import { cn } from "@/lib/utils"

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "warning" | "success" | "danger" | "note"
  title?: string
}

const LightbulbIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
)

const AlertTriangleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
)

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
)

const PenToolIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z" />
    <path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18" />
    <path d="m2.3 2.3 7.286 7.286" />
    <circle cx="11" cy="11" r="2" />
  </svg>
)

const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, variant = "note", title, children, ...props }, ref) => {
    const variants = {
      info: {
        container: "border-[var(--color-info)] bg-[var(--color-info)]/10",
        icon: <LightbulbIcon className="w-5 h-5 text-[var(--color-info)]" />
      },
      warning: {
        container: "border-[var(--color-warning)] bg-[var(--color-warning)]/10",
        icon: <AlertTriangleIcon className="w-5 h-5 text-[var(--color-warning)]" />
      },
      success: {
        container: "border-[var(--color-success)] bg-[var(--color-success)]/10",
        icon: <CheckCircleIcon className="w-5 h-5 text-[var(--color-success)]" />
      },
      danger: {
        container: "border-[var(--color-danger)] bg-[var(--color-danger)]/10",
        icon: <AlertTriangleIcon className="w-5 h-5 text-[var(--color-danger)]" />
      },
      note: {
        container: "border-[var(--color-primary)] bg-[var(--color-primary)]/10",
        icon: <PenToolIcon className="w-5 h-5 text-[var(--color-primary)]" />
      }
    }

    const variantConfig = variants[variant]

    return (
      <div
        ref={ref}
        className={cn(
          "border-l-4 rounded-r-[var(--radius-md)] p-4",
          variantConfig.container,
          className
        )}
        {...props}
      >
        <div className="flex gap-3">
          <div className="shrink-0 mt-0.5">
            {variantConfig.icon}
          </div>
          <div className="flex-1">
            {title && (
              <h4 className="font-medium text-[var(--color-text)] mb-1">
                {title}
              </h4>
            )}
            <div className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }
)
Callout.displayName = "Callout"

export { Callout }
