export function formatAdminWhen(iso: string | null | undefined) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function formatAdminDate(iso: string | null | undefined) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso))
}

export function weekAgoIso() {
  return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
}
