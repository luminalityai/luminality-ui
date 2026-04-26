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
  timezone?: string
}

export function Time({
  date,
  format = "date",
  className,
  timezone,
}: TimeProps) {
  const context = React.use(TimezoneContext)
  const resolvedTimezone = timezone || context || getLocalTimezone() || "UTC"

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

  return (
    <time dateTime={date} title={resolvedTimezone} className={className}>
      {displayText}
    </time>
  )
}
