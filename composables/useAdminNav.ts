export type AdminTone = 'dashboard' | 'events' | 'rsvps' | 'inbox' | 'prayer' | 'newsletter' | 'content'

export interface AdminNavItem {
  label: string
  to: string
  description?: string
  tone: AdminTone
}

export const ADMIN_NAV: AdminNavItem[] = [
  {label: 'Dashboard', to: '/admin', description: 'Overview and stats', tone: 'dashboard'},
  // {label: 'Content', to: '/admin/content', description: 'Pages, ministries, and site copy', tone: 'content'},
  {label: 'Events', to: '/admin/events', description: 'Custom one-off events', tone: 'events'},
  {label: 'RSVPs', to: '/admin/rsvps', description: 'Event registrations', tone: 'rsvps'},
  {label: 'Inbox', to: '/admin/inbox', description: 'Contact and connect messages', tone: 'inbox'},
  {label: 'Prayer', to: '/admin/prayer', description: 'Prayer requests', tone: 'prayer'},
  {label: 'Newsletter', to: '/admin/newsletter', description: 'Email subscribers', tone: 'newsletter'},
]

export function useAdminNav() {
  const route = useRoute()

  const items = computed(() =>
    ADMIN_NAV.map((item) => ({
      ...item,
      active: item.to === '/admin'
        ? route.path === '/admin'
        : route.path.startsWith(item.to),
    })),
  )

  return {items}
}

export function useAdminTone() {
  const route = useRoute()
  return computed(() => {
    const match = ADMIN_NAV.find((item) =>
      item.to === '/admin' ? route.path === '/admin' : route.path.startsWith(item.to),
    )
    return match?.tone ?? 'dashboard'
  })
}

export interface AdminStats {
  events: {total: number; upcoming: number}
  rsvps: {week: number; total: number; recurringWeek: number}
  inbox: {unhandled: number; week: number}
  prayer: {unhandled: number; week: number}
  newsletter: {total: number; week: number}
}

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

export function downloadCsv(filename: string, rows: string[][]) {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`
  const body = rows.map((row) => row.map((cell) => escape(cell)).join(',')).join('\n')
  const blob = new Blob([body], {type: 'text/csv;charset=utf-8;'})
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
