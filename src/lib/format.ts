/** Iniciais para avatares (ex.: "Ana Melo" → "AM"). */
export function getInitials(name?: string | null): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

/** Primeiro nome, usado em saudações. */
export function getFirstName(name?: string | null): string {
  if (!name) return ''
  return name.trim().split(/\s+/)[0] ?? ''
}

/** Data relativa curta em português ("hoje", "ontem", "há 3 dias" ou dd/mm/aaaa). */
export function formatRelativeDate(value: Date | string): string {
  const date = new Date(value)
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const diffDays = Math.round((startOf(new Date()) - startOf(date)) / 86_400_000)

  if (diffDays <= 0) return 'hoje'
  if (diffDays === 1) return 'ontem'
  if (diffDays < 7) return `há ${diffDays} dias`
  return date.toLocaleDateString('pt-BR')
}
