import { formatDistanceToNowStrict } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

const DEFAULT_TIMEZONE = 'UTC'
const DATE_PATTERN = 'yyyy.MM.dd'
const DATETIME_PATTERN = 'yyyy.MM.dd HH:mm'
const TIMEZONE_PATTERN = 'zzz'

function parseDate(isoString: string | null): Date | null {
  if (!isoString) return null

  const date = new Date(isoString)
  return isNaN(date.getTime()) ? null : date
}

export function getLocalTimezone(): string | undefined {
  if (typeof Intl === 'undefined' || typeof Intl.DateTimeFormat !== 'function') return undefined

  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return undefined
  }
}

function formatWithTimezoneFallback(date: Date, timezone: string | undefined, pattern: string) {
  const tz = timezone || DEFAULT_TIMEZONE

  try {
    return formatInTimeZone(date, tz, pattern)
  } catch {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[@rarebit-one/luminality-ui] Invalid timezone "${tz}", falling back to UTC`)
    }
    return formatInTimeZone(date, DEFAULT_TIMEZONE, pattern)
  }
}

export function formatDate(isoString: string | null, timezone?: string): string {
  const date = parseDate(isoString)
  if (!date) return '—'

  return formatWithTimezoneFallback(date, timezone, DATE_PATTERN)
}

function getTimezoneAbbreviation(date: Date, timezone?: string): string {
  return formatWithTimezoneFallback(date, timezone, TIMEZONE_PATTERN)
}

export function formatDateTime(
  isoString: string | null,
  showTimezone = false,
  timezone?: string,
): string {
  const date = parseDate(isoString)
  if (!date) return '—'

  const baseFormat = formatWithTimezoneFallback(date, timezone, DATETIME_PATTERN)

  if (!showTimezone) return baseFormat

  const tz = getTimezoneAbbreviation(date, timezone)
  return tz ? `${baseFormat} ${tz}` : baseFormat
}

export function formatDateTimeWithTimezone(isoString: string | null, timezone?: string): string {
  return formatDateTime(isoString, true, timezone)
}

export function formatRelativeTime(isoString: string | null): string {
  const date = parseDate(isoString)
  if (!date) return '—'

  return formatDistanceToNowStrict(date, { addSuffix: true })
}
