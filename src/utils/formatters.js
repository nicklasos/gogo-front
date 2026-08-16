/**
 * Format an ISO date string for table display.
 */
export function formatDateTime(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleString()
}

/**
 * Build Ant Design pagination state from gogo PaginationMeta.
 */
export function paginationFromMeta(meta, fallback = {}) {
  return {
    current: meta?.current_page ?? fallback.current ?? 1,
    pageSize: meta?.per_page ?? fallback.pageSize ?? 20,
    total: meta?.total ?? fallback.total ?? 0,
  }
}
