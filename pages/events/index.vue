<script setup lang="ts">
type SiteEvent = {
  id: string
  slug: string
  title: string
  starts_at: string
  ends_at: string | null
  location: string | null
  summary: string | null
  description: string | null
  image_url: string | null
  register_url: string | null
  recurring?: boolean
}

const view = ref<'list' | 'month' | 'day'>('list')
const range = ref<'upcoming' | 'past'>('upcoming')
const search = ref('')
const monthCursor = ref(startOfMonth(new Date()))
const page = ref(1)
const perPage = 10

const {data: upcoming, refresh: refreshUpcoming} = await useFetch<SiteEvent[]>('/api/events', {
  key: 'events-upcoming-v3',
  default: () => [],
})

const {data: past, refresh: refreshPast} = await useFetch<SiteEvent[]>('/api/events', {
  key: 'events-all-v3',
  query: {includePast: 'true'},
  default: () => [],
})

onMounted(() => {
  refreshUpcoming()
  refreshPast()
})

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

const sourceEvents = computed(() => {
  const now = new Date()
  const items = range.value === 'upcoming'
    ? (upcoming.value ?? [])
    : (past.value ?? []).filter((item) => new Date(item.starts_at) < now)

  const query = search.value.trim().toLowerCase()
  if (!query) return items

  return items.filter((item) =>
    [item.title, item.summary, item.location].filter(Boolean).join(' ').toLowerCase().includes(query),
  )
})

const visibleEvents = computed(() => {
  if (view.value === 'month') {
    return sourceEvents.value.filter((item) =>
      isSameMonth(new Date(item.starts_at), monthCursor.value),
    )
  }

  if (view.value === 'day') {
    return sourceEvents.value.filter((item) =>
      isSameDay(new Date(item.starts_at), monthCursor.value),
    )
  }

  return sourceEvents.value
})

const totalEvents = computed(() => visibleEvents.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalEvents.value / perPage)))

const paginatedEvents = computed(() => {
  const start = (page.value - 1) * perPage
  return visibleEvents.value.slice(start, start + perPage)
})

const pageStart = computed(() =>
  totalEvents.value ? (page.value - 1) * perPage + 1 : 0,
)

const pageEnd = computed(() =>
  Math.min(page.value * perPage, totalEvents.value),
)

watch([search, range, view, monthCursor], () => {
  page.value = 1
})

watch(totalPages, (pages) => {
  if (page.value > pages) page.value = pages
})

function goToPage(next: number) {
  page.value = Math.min(Math.max(1, next), totalPages.value)
}

const groupedEvents = computed(() => {
  const groups = new Map<string, SiteEvent[]>()

  for (const item of paginatedEvents.value) {
    const date = new Date(item.starts_at)
    const key = date.toLocaleDateString('en-US', {month: 'long', year: 'numeric'})
    const bucket = groups.get(key) ?? []
    bucket.push(item)
    groups.set(key, bucket)
  }

  return [...groups.entries()]
})

function eventHref(item: SiteEvent) {
  return item.recurring ? `/events/${item.id}` : `/events/${item.slug}`
}

function dayShort(date: string) {
  return new Date(date).toLocaleDateString('en-US', {weekday: 'short'})
}

function dayNum(date: string) {
  return new Date(date).getDate()
}

function formatWhen(start: string, end: string | null) {
  const startDate = new Date(start)
  const datePart = startDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const startTime = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).toLowerCase()

  if (!end) return `${datePart} @ ${startTime}`

  const endTime = new Date(end).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).toLowerCase()

  return `${datePart} @ ${startTime} - ${endTime}`
}

function goToday() {
  monthCursor.value = startOfMonth(new Date())
}

function goMonth(offset: number) {
  const next = new Date(monthCursor.value)
  next.setMonth(next.getMonth() + offset)
  monthCursor.value = startOfMonth(next)
}

const monthLabel = computed(() =>
  monthCursor.value.toLocaleDateString('en-US', {month: 'long', year: 'numeric'}),
)

function listFadeDelay(groupIndex: number, itemIndex: number) {
  return groupIndex * 0.05 + itemIndex * 0.08
}

useSeoMeta({
  title: 'Events',
  description: 'Upcoming events at RCCG Word of Life Center — Sunday worship, Bible study, and special gatherings.',
})
</script>

<template>
  <div>
    <PageHeader
      title="Events"
      :crumbs="[{label: 'Home', href: '/'}, {label: 'Events'}]"
    />

    <section class="block block-tight events-page">
      <div class="wrap">
        <p class="events-count reveal">
          <template v-if="totalEvents">
            Showing {{ pageStart }}–{{ pageEnd }} of {{ totalEvents }} events
          </template>
          <template v-else>
            No events found.
          </template>
        </p>

        <div class="events-toolbar reveal">
          <label class="search-field">
            <span class="sr-only">Search for events by keyword</span>
            <input
              v-model="search"
              type="search"
              placeholder="Enter keyword. Search for events by keyword."
            >
            <span class="search-btn">Find Events</span>
          </label>

          <div class="toolbar-row">
            <div class="view-tabs" role="tablist" aria-label="Event views">
              <button
                type="button"
                class="view-tab"
                :class="{active: view === 'list'}"
                @click="view = 'list'"
              >
                List
              </button>
              <button
                type="button"
                class="view-tab"
                :class="{active: view === 'month'}"
                @click="view = 'month'"
              >
                Month
              </button>
              <button
                type="button"
                class="view-tab"
                :class="{active: view === 'day'}"
                @click="view = 'day'"
              >
                Day
              </button>
            </div>

            <div class="range-tabs">
              <button
                type="button"
                class="range-tab"
                :class="{active: range === 'upcoming'}"
                @click="range = 'upcoming'"
              >
                Upcoming
              </button>
              <button
                type="button"
                class="range-tab"
                :class="{active: range === 'past'}"
                @click="range = 'past'"
              >
                Past Events
              </button>
            </div>
          </div>
        </div>

        <div v-if="view !== 'list'" class="month-nav reveal">
          <button type="button" class="nav-link-btn" @click="goMonth(-1)">Previous Events</button>
          <button type="button" class="nav-link-btn nav-link-btn--strong" @click="goToday">Today</button>
          <button type="button" class="nav-link-btn" @click="goMonth(1)">Next Events</button>
          <p class="month-nav__label">{{ monthLabel }}</p>
        </div>

        <div v-if="groupedEvents.length" class="events-groups">
          <section
            v-for="([month, items], groupIndex) in groupedEvents"
            :key="month"
            class="events-month"
          >
            <ClientOnly>
              <template v-if="view === 'list'">
                <BitsFadeContent
                  :blur="true"
                  :duration="900"
                  ease="power2.out"
                  :initial-opacity="0"
                  :threshold="0.12"
                >
                  <h2 class="events-month__title">{{ month }}</h2>
                </BitsFadeContent>
              </template>

              <BitsFadeContent
                v-for="(item, itemIndex) in items"
                :key="item.id"
                :blur="true"
                :duration="900"
                ease="power2.out"
                :initial-opacity="0"
                :delay="listFadeDelay(groupIndex, itemIndex)"
                :threshold="0.12"
              >
                <article class="event-item">
                  <div class="event-item__date">
                    <span class="event-item__dow">{{ dayShort(item.starts_at) }}</span>
                    <span class="event-item__day">{{ dayNum(item.starts_at) }}</span>
                  </div>

                  <div class="event-item__body">
                    <div v-if="item.image_url" class="event-item__media">
                      <img :src="item.image_url" :alt="item.title" loading="lazy">
                    </div>

                    <div class="event-item__copy">
                      <h3>
                        <NuxtLink :to="eventHref(item)">{{ item.title }}</NuxtLink>
                      </h3>
                      <p class="event-item__when">{{ formatWhen(item.starts_at, item.ends_at) }}</p>
                      <p v-if="item.location" class="event-item__loc">{{ item.location }}</p>
                      <p v-if="item.summary" class="event-item__summary">{{ item.summary }}</p>
                    </div>
                  </div>
                </article>
              </BitsFadeContent>

              <template #fallback>
                <h2 v-if="view === 'list'" class="events-month__title">{{ month }}</h2>
                <article
                  v-for="item in items"
                  :key="`${item.id}-fallback`"
                  class="event-item"
                >
                  <div class="event-item__date">
                    <span class="event-item__dow">{{ dayShort(item.starts_at) }}</span>
                    <span class="event-item__day">{{ dayNum(item.starts_at) }}</span>
                  </div>

                  <div class="event-item__body">
                    <div v-if="item.image_url" class="event-item__media">
                      <img :src="item.image_url" :alt="item.title" loading="lazy">
                    </div>

                    <div class="event-item__copy">
                      <h3>
                        <NuxtLink :to="eventHref(item)">{{ item.title }}</NuxtLink>
                      </h3>
                      <p class="event-item__when">{{ formatWhen(item.starts_at, item.ends_at) }}</p>
                      <p v-if="item.location" class="event-item__loc">{{ item.location }}</p>
                      <p v-if="item.summary" class="event-item__summary">{{ item.summary }}</p>
                    </div>
                  </div>
                </article>
              </template>
            </ClientOnly>
          </section>
        </div>

        <div v-else class="empty-state reveal">
          <p>No events match your search. Try another keyword or switch to Upcoming.</p>
        </div>

        <nav
          v-if="totalEvents > perPage"
          class="events-pagination reveal"
          aria-label="Events pagination"
        >
          <button
            type="button"
            class="page-btn"
            :disabled="page <= 1"
            @click="goToPage(page - 1)"
          >
            Previous
          </button>

          <div class="page-numbers">
            <button
              v-for="n in totalPages"
              :key="n"
              type="button"
              class="page-btn page-btn--num"
              :class="{active: n === page}"
              :aria-current="n === page ? 'page' : undefined"
              @click="goToPage(n)"
            >
              {{ n }}
            </button>
          </div>

          <button
            type="button"
            class="page-btn"
            :disabled="page >= totalPages"
            @click="goToPage(page + 1)"
          >
            Next
          </button>
        </nav>

        <div class="subscribe reveal">
          <h2>Subscribe to calendar</h2>
          <div class="subscribe-links">
            <a
              href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Sunday%20Service&details=Weekly%20worship%20at%2010%3A00%20AM&location=11313%20Lockwood%20Dr%2C%20Silver%20Spring%20MD%2020904"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Calendar
            </a>
            <a href="/api/events/calendar.ics" download="wolc-events.ics">iCalendar (.ics)</a>
            <a href="/api/events/calendar.ics" download="wolc-events.ics">Outlook (.ics)</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.events-page {
  background: var(--white);
}
.events-count {
  color: var(--muted);
  font-size: 0.95rem;
  margin-bottom: 22px;
}
.events-toolbar {
  display: grid;
  gap: 18px;
  margin-bottom: 28px;
}
.search-field {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
}
.search-field input {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  font: inherit;
  background: var(--white);
}
.search-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 18px;
  border-radius: var(--radius-sm);
  background: var(--blue);
  color: var(--white);
  font-weight: 600;
  font-size: 0.92rem;
  white-space: nowrap;
}
.toolbar-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: space-between;
  align-items: center;
}
.view-tabs,
.range-tabs {
  display: inline-flex;
  gap: 6px;
  flex-wrap: wrap;
}
.view-tab,
.range-tab,
.nav-link-btn {
  border: 1px solid var(--line);
  background: var(--white);
  color: var(--ink-2);
  border-radius: 999px;
  padding: 8px 14px;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.view-tab.active,
.range-tab.active {
  background: var(--blue-soft);
  border-color: rgba(var(--blue-rgb), 0.18);
  color: var(--blue);
}
.month-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-bottom: 24px;
}
.nav-link-btn--strong {
  background: var(--blue);
  border-color: var(--blue);
  color: var(--white);
}
.month-nav__label {
  width: 100%;
  font-family: var(--display);
  font-weight: 700;
  font-size: 1.35rem;
  margin-top: 6px;
}
.events-groups {
  display: grid;
  gap: 34px;
}
.events-month__title {
  font-family: var(--display);
  font-weight: 700;
  font-size: clamp(1.5rem, 3vw, 1.85rem);
  margin-bottom: 18px;
  letter-spacing: -0.02em;
}
.event-item {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 22px;
  padding: 24px 0;
  border-top: 1px solid var(--line);
}
.event-item__date {
  text-align: center;
  padding-top: 4px;
}
.event-item__dow {
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--blue);
}
.event-item__day {
  display: block;
  font-family: var(--display);
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
  margin-top: 4px;
  color: var(--ink);
}
.event-item__body {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 20px;
  align-items: start;
}
.event-item__media {
  border-radius: var(--radius-md);
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background: var(--paper);
}
.event-item__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.event-item__copy h3 {
  font-family: var(--display);
  font-size: clamp(1.15rem, 2.2vw, 1.45rem);
  line-height: 1.2;
  margin-bottom: 8px;
}
.event-item__copy h3 a:hover {
  color: var(--blue);
}
.event-item__when {
  color: var(--ink-3);
  font-weight: 600;
  font-size: 0.94rem;
  margin-bottom: 8px;
}
.event-item__loc {
  color: var(--muted);
  font-size: 0.92rem;
  margin-bottom: 10px;
}
.event-item__summary {
  color: var(--muted);
  font-size: 0.96rem;
  line-height: 1.6;
  max-width: 62ch;
}
.events-pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 36px;
  padding-top: 28px;
  border-top: 1px solid var(--line);
}
.page-numbers {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}
.page-btn {
  border: 1px solid var(--line);
  background: var(--white);
  color: var(--ink-2);
  border-radius: 999px;
  padding: 9px 16px;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.page-btn:hover:not(:disabled) {
  border-color: rgba(var(--blue-rgb), 0.28);
  background: var(--blue-soft);
  color: var(--blue);
}
.page-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.page-btn--num {
  min-width: 42px;
  padding-inline: 12px;
}
.page-btn--num.active {
  background: var(--blue);
  border-color: var(--blue);
  color: var(--white);
}
.subscribe {
  margin-top: 48px;
  padding-top: 28px;
  border-top: 1px solid var(--line);
}
.subscribe h2 {
  font-family: var(--display);
  font-size: 1.2rem;
  margin-bottom: 14px;
}
.subscribe-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 18px;
}
.subscribe-links a {
  color: var(--blue);
  font-weight: 600;
  font-size: 0.94rem;
}
.subscribe-links a:hover {
  text-decoration: underline;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
@media (max-width: 760px) {
  .search-field {
    grid-template-columns: 1fr;
  }
  .event-item {
    grid-template-columns: 56px 1fr;
    gap: 14px;
  }
  .event-item__body {
    grid-template-columns: 1fr;
  }
  .event-item__media {
    max-width: 220px;
  }
}
</style>
