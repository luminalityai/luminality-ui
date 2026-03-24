import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]",
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

type PaddingSize = "sm" | "md" | "lg"

const PADDING_STYLES: Record<PaddingSize, Record<string, string>> = {
  sm: { header: "p-3", content: "p-3", footer: "p-3" },
  md: { header: "p-4 pb-2", content: "p-4 pt-2", footer: "p-4" },
  lg: { header: "p-6", content: "p-6", footer: "p-6" },
}

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { padding?: PaddingSize }>(
  ({ className, padding = "md", ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5", PADDING_STYLES[padding].header, className)}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight text-[var(--color-text)]", className)}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-[var(--color-text-muted)]", className)}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { padding?: PaddingSize }>(
  ({ className, padding = "md", ...props }, ref) => (
    <div ref={ref} className={cn(PADDING_STYLES[padding].content, className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { padding?: PaddingSize }>(
  ({ className, padding = "md", ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center", PADDING_STYLES[padding].footer, className)}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
