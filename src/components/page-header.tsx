import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/breadcrumb"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
  actions?: React.ReactNode
  showBackButton?: boolean
  onBackClick?: () => void
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  (
    {
      className,
      title,
      breadcrumbs,
      actions,
      showBackButton,
      onBackClick,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4",
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={`${crumb.href ?? ""}:${crumb.label}`}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.href}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
          {title && !breadcrumbs && (
            <h1 className="text-xl font-semibold text-[var(--color-text)]">
              {title}
            </h1>
          )}
          {children}
        </div>

        <div className="flex items-center gap-3">
          {actions}
          {showBackButton && (
            <button
              type="button"
              aria-label="Go back"
              onClick={onBackClick}
              className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              </svg>
              Back
            </button>
          )}
        </div>
      </div>
    )
  },
)
PageHeader.displayName = "PageHeader"

export { PageHeader }
export type { PageHeaderProps }
