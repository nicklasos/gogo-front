/**
 * Display formatting for numbers and dates.
 * The locale follows the app language (`setFormatLanguage`, called by i18n), never the browser.
 * Every formatter returns `—` for a missing value, never 0.
 */

export const EMPTY = '—'
/** Display format for DatePicker and dates. */
export const DATE_FORMAT = 'DD.MM.YYYY'

type Lang = 'uk' | 'en'

const LOCALES: Record<Lang, string> = { uk: 'uk-UA', en: 'en-GB' }

let lang: Lang = 'en'

export function setFormatLanguage(language: string | undefined): void {
  lang = language?.startsWith('uk') ? 'uk' : 'en'
}

const missing = (value: number | null | undefined): value is null | undefined => value == null || !Number.isFinite(value)

export function formatNumber(value: number | null | undefined, digits = 2): string {
  if (missing(value)) return EMPTY
  return new Intl.NumberFormat(LOCALES[lang], { maximumFractionDigits: digits }).format(value)
}

/** "2026-09-11" or an RFC3339 timestamp → "11.09.2026" (the date part only, no timezone shift). */
export function formatDate(value: string | null | undefined): string {
  if (!value) return EMPTY
  const [y, m, d] = value.slice(0, 10).split('-')
  return y && m && d ? `${d}.${m}.${y}` : String(value)
}

/** A timestamp in local time: "11.09.2026 14:05". */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return EMPTY
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** Local calendar date as YYYY-MM-DD (what the API expects for dates). */
export function isoDate(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}
