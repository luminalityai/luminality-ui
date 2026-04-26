import * as React from "react"
import {
  formatDate,
  formatDateTime,
  formatDateTimeWithTimezone,
  formatRelativeTime,
  getLocalTimezone,
} from "@/lib/format-date"

const TimezoneContext = React.createContext<string | undefined>(undefined)

export interface TimezoneProviderProps {
  value: string | undefined
  children: React.ReactNode
}

export function TimezoneProvider({ value, children }: TimezoneProviderProps) {
  // Skip the provider when value is undefined so a parent provider isn't shadowed.
  if (!value) return <>{children}</>
  return <TimezoneContext value={value}>{children}</TimezoneContext>
}

export function useTimezone(): string {
  const context = React.use(TimezoneContext)
  return context || getLocalTimezone() || "UTC"
}

export type TimeFormat = "date" | "datetime" | "datetime-tz" | "relative"

export interface TimeProps {
  date: string | null
  format?: TimeFormat
  className?: string
  /** Ignored when `format="relative"` (relative time is timezone-independent). */
  timezone?: string
}

export function Time({
  date,
  format = "date",
  className,
  timezone,
}: TimeProps) {
  const fallbackTimezone = useTimezone()
  const resolvedTimezone = timezone || fallbackTimezone

  if (date === null) {
    return <span className={className}>—</span>
  }

  let displayText: string
  switch (format) {
    case "datetime":
      displayText = formatDateTime(date, false, resolvedTimezone)
      break
    case "datetime-tz":
      displayText = formatDateTimeWithTimezone(date, resolvedTimezone)
      break
    case "relative":
      displayText = formatRelativeTime(date)
      break
    case "date":
    default:
      displayText = formatDate(date, resolvedTimezone)
      break
  }

  // formatters return "—" for unparseable input — avoid emitting <time> with an invalid dateTime attr.
  if (displayText === "—") {
    return <span className={className}>—</span>
  }

  return (
    <time dateTime={date} title={resolvedTimezone} className={className}>
      {displayText}
    </time>
  )
}
