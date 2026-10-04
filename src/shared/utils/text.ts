export function matchesSearch(query: string, ...fields: (string | number | null | undefined)[]): boolean {
  const needle = query.trim().toLocaleLowerCase()
  if (!needle) return true
  return fields.some((field) => field != null && String(field).toLocaleLowerCase().includes(needle))
}
