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

const route = useRoute()
const key = route.params.slug as string

const {data: settings} = await useAsyncData('event-settings', () =>
  queryCollection('settings').first(),
)

const {data: events, refresh: refreshEvents} = await useFetch<SiteEvent[]>('/api/events', {
  key: 'events-detail-v3',
  query: {includePast: 'true'},
  default: () => [],
})

onMounted(() => refreshEvents())

const sortedEvents = computed(() =>
  [...(events.value ?? [])].sort(
    (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
  ),
)

const event = computed(() => {
  const items = sortedEvents.value
  return items.find((e) => e.id === key) ?? items.find((e) => e.slug === key)
})

const eventIndex = computed(() =>
  event.value ? sortedEvents.value.findIndex((e) => e.id === event.value!.id) : -1,
)

const prevEvent = computed(() =>
  eventIndex.value > 0 ? sortedEvents.value[eventIndex.value - 1] : null,
)

const nextEvent = computed(() =>
  eventIndex.value >= 0 && eventIndex.value < sortedEvents.value.length - 1
    ? sortedEvents.value[eventIndex.value + 1]
    : null,
)

const isPast = computed(() =>
  event.value ? new Date(event.value.starts_at) < new Date() : false,
)

const showRsvp = computed(() => event.value && !isPast.value)

const websiteLink = computed(() => {
  if (!event.value) return null
  if (event.value.slug === 'bible-study') {
    return {label: 'Watch online', href: '/livestream'}
  }
  if (event.value.slug === 'sunday-service') {
    return {label: 'Plan a visit', href: '/visit'}
  }
  if (event.value.register_url) {
    return {label: 'Register online', href: event.value.register_url, external: true}
  }
  return null
})

const organizer = computed(() => {
  const parts = [settings.value?.title, settings.value?.subtitle].filter(Boolean)
  return parts.join(' ') || 'RCCG Word of Life Center'
})

const crumbs = computed(() => [
  {label: 'Home', href: '/'},
  {label: 'Events', href: '/events'},
  {label: event.value?.title || 'Event'},
])

function eventPath(item: SiteEvent) {
  return item.recurring ? `/events/${item.id}` : `/events/${item.slug}`
}

function formatDateOnly(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTimeRange(start: string, end: string | null) {
  const startTime = new Date(start).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).toLowerCase()

  if (!end) return startTime

  const endTime = new Date(end).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).toLowerCase()

  return `${startTime} – ${endTime}`
}

function toGoogleCalendarDate(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
}

const googleCalendarUrl = computed(() => {
  if (!event.value) return ''
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.value.title,
    dates: `${toGoogleCalendarDate(event.value.starts_at)}/${toGoogleCalendarDate(event.value.ends_at || event.value.starts_at)}`,
    details: event.value.description || event.value.summary || '',
    location: event.value.location || '',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
})

const form = reactive({name: '', email: '', guests: 1, website: ''})
const state = ref<'idle' | 'sending' | 'done' | 'error'>('idle')
const errorMsg = ref('')

async function submitRsvp() {
  if (!event.value) return
  state.value = 'sending'
  errorMsg.value = ''
  try {
    await $fetch('/api/rsvp', {
      method: 'POST',
      body: {
        eventId: event.value.id,
        name: form.name,
        email: form.email,
        guests: Number(form.guests),
        website: form.website || undefined,
      },
    })
    state.value = 'done'
  } catch (e: any) {
    state.value = 'error'
    errorMsg.value = e?.statusMessage || 'Something went wrong. Please try again.'
  }
}

useSiteSeo({
  title: () => event.value?.title || 'Event',
  description: () =>
    event.value?.summary || event.value?.description || 'Event at RCCG Word of Life Center.',
  image: () => event.value?.image_url || undefined,
})

watch(
  [events, () => key],
  () => {
    if (events.value == null) return
    if (!event.value) {
      throw createError({statusCode: 404, statusMessage: 'Event not found'})
    }
  },
  {immediate: true},
)
</script>

<template>
  <div>
    <template v-if="event">
      <header class="event-hero" :class="{ 'event-hero--past': isPast }">
        <div
          v-if="event.image_url"
          class="event-hero__media"
          :style="{ backgroundImage: `url(${event.image_url})` }"
          aria-hidden="true"
        />
        <div class="event-hero__overlay" aria-hidden="true" />

        <div class="wrap event-hero__inner">
          <nav class="page-crumb" aria-label="Breadcrumb">
            <template v-for="(crumb, i) in crumbs" :key="`${crumb.label}-${i}`">
              <NuxtLink v-if="crumb.href" :to="crumb.href">{{ crumb.label }}</NuxtLink>
              <span v-else>{{ crumb.label }}</span>
              <span v-if="i < crumbs.length - 1" aria-hidden="true">/</span>
            </template>
          </nav>

          <div class="event-hero__head">
            <div class="event-hero__copy">
              <span class="eyebrow-dark">Event</span>
              <h1>{{ event.title }}</h1>
            </div>

            <div class="event-hero__actions">
              <span v-if="isPast" class="status-badge status-badge--past">Past event</span>
              <span v-else class="status-badge status-badge--upcoming">Upcoming</span>

              <NuxtLink
                v-if="websiteLink && !websiteLink.external"
                :to="websiteLink.href"
                class="btn btn-primary"
              >
                {{ websiteLink.label }} →
              </NuxtLink>
              <a
                v-else-if="websiteLink?.external"
                :href="websiteLink.href"
                class="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ websiteLink.label }} →
              </a>
            </div>
          </div>
        </div>
      </header>

      <section class="block block-tight event-body">
        <div class="wrap">
          <div class="details-panel reveal">
            <p v-if="event.description || event.summary" class="details-panel__intro">
              {{ event.description || event.summary }}
            </p>

            <div class="details-panel__grid">
              <div class="detail-item">
                <span class="detail-item__label">Date</span>
                <span class="detail-item__value">{{ formatDateOnly(event.starts_at) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-item__label">Time</span>
                <span class="detail-item__value">{{ formatTimeRange(event.starts_at, event.ends_at) }}</span>
              </div>
              <div v-if="event.location" class="detail-item">
                <span class="detail-item__label">Location</span>
                <span class="detail-item__value">{{ event.location }}</span>
              </div>
              <div v-if="websiteLink" class="detail-item">
                <span class="detail-item__label">Website</span>
                <span class="detail-item__value">
                  <NuxtLink v-if="!websiteLink.external" :to="websiteLink.href" class="detail-link">
                    {{ websiteLink.label }}
                  </NuxtLink>
                  <a
                    v-else
                    :href="websiteLink.href"
                    class="detail-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ websiteLink.label }}
                  </a>
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-item__label">Organizer</span>
                <span class="detail-item__value">{{ organizer }}</span>
              </div>
            </div>

            <div class="details-panel__calendar">
              <span class="detail-item__label">Add to calendar</span>
              <div class="calendar-actions">
                <a
                  :href="googleCalendarUrl"
                  class="calendar-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Calendar
                </a>
                <a href="/api/events/calendar.ics" class="calendar-btn" download="wolc-events.ics">
                  iCalendar (.ics)
                </a>
                <a href="/api/events/calendar.ics" class="calendar-btn" download="wolc-events.ics">
                  Outlook (.ics)
                </a>
              </div>
            </div>

            <div v-if="showRsvp" class="details-panel__rsvp">
              <h2>RSVP</h2>
              <template v-if="state !== 'done'">
                <form @submit.prevent="submitRsvp">
                  <div class="form-honeypot" aria-hidden="true">
                    <label for="rsvp-website">Website</label>
                    <input
                      id="rsvp-website"
                      v-model="form.website"
                      type="text"
                      name="website"
                      tabindex="-1"
                      autocomplete="off"
                    >
                  </div>
                  <div class="rsvp-fields">
                  <label>
                    <span class="field-label">Name</span>
                    <input v-model="form.name" class="form-field" type="text" required>
                  </label>
                  <label>
                    <span class="field-label">Email</span>
                    <input v-model="form.email" class="form-field" type="email" required>
                  </label>
                  <label>
                    <span class="field-label">Guests</span>
                    <input v-model.number="form.guests" class="form-field" type="number" min="1" max="20">
                  </label>
                </div>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="state === 'sending' || !form.name || !form.email"
                >
                  {{ state === 'sending' ? 'Sending…' : 'Save my spot' }}
                </button>
                <p v-if="state === 'error'" class="status-err">{{ errorMsg }}</p>
                </form>
              </template>
              <p v-else class="status-ok">You're in. See you there.</p>
            </div>
          </div>

          <nav v-if="prevEvent || nextEvent" class="event-nav reveal" aria-label="Event navigation">
            <NuxtLink
              v-if="prevEvent"
              :to="eventPath(prevEvent)"
              class="event-nav-btn event-nav-btn--prev"
            >
              <span class="event-nav-arrow" aria-hidden="true">←</span>
              <span class="event-nav-content">
                <span class="event-nav-label">Previous event</span>
                <span class="event-nav-title">{{ prevEvent.title }}</span>
                <span class="event-nav-date">{{ formatShortDate(prevEvent.starts_at) }}</span>
              </span>
            </NuxtLink>
            <div v-else class="event-nav-btn event-nav-btn--empty" aria-hidden="true" />

            <NuxtLink
              v-if="nextEvent"
              :to="eventPath(nextEvent)"
              class="event-nav-btn event-nav-btn--next"
            >
              <span class="event-nav-content">
                <span class="event-nav-label">Next event</span>
                <span class="event-nav-title">{{ nextEvent.title }}</span>
                <span class="event-nav-date">{{ formatShortDate(nextEvent.starts_at) }}</span>
              </span>
              <span class="event-nav-arrow" aria-hidden="true">→</span>
            </NuxtLink>
          </nav>
        </div>
      </section>
    </template>

    <template v-else-if="events == null">
      <PageHeader title="Loading event…" />
    </template>
  </div>
</template>

<style scoped>
.event-hero {
  position: relative;
  margin-top: var(--nav-offset);
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, var(--blue) 100%);
  color: var(--white);
  overflow: hidden;
}

.event-hero--past {
  background: linear-gradient(135deg, #334155 0%, #475569 100%);
}

.event-hero__media {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.34;
}

.event-hero__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.15) 0%, rgba(15, 23, 42, 0.72) 100%),
    linear-gradient(90deg, rgba(15, 23, 42, 0.82) 0%, rgba(15, 23, 42, 0.35) 100%);
}

.event-hero__inner {
  position: relative;
  z-index: 1;
  padding: 28px var(--layout-shell-x) 40px;
}

.event-hero .page-crumb {
  color: rgba(255, 255, 255, 0.72);
  margin-bottom: 22px;
}

.event-hero .page-crumb a {
  color: rgba(255, 255, 255, 0.92);
}

.event-hero .page-crumb a:hover {
  color: var(--white);
}

.event-hero .eyebrow-dark {
  color: rgba(255, 255, 255, 0.72);
  margin-bottom: 10px;
}

.event-hero__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
}

.event-hero__actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 14px;
  flex-shrink: 0;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.status-badge--upcoming {
  background: rgba(255, 255, 255, 0.16);
  color: var(--white);
  border: 1px solid rgba(255, 255, 255, 0.24);
}

.status-badge--past {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.16);
}

.event-hero__copy h1 {
  font-family: var(--display);
  font-size: clamp(2rem, 4.8vw, 3rem);
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.02em;
  max-width: 18ch;
}

.event-body {
  padding-bottom: 72px;
}

.details-panel {
  width: 100%;
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  padding: 32px;
  box-shadow: 0 14px 40px rgba(var(--blue-rgb), 0.06);
}

.details-panel__intro {
  color: var(--muted);
  font-size: 1.08rem;
  line-height: 1.75;
  padding-bottom: 28px;
  margin-bottom: 28px;
  border-bottom: 1px solid var(--line);
}

.details-panel__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px 40px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-item__label {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.detail-item__value {
  color: var(--ink);
  font-size: 1rem;
  line-height: 1.55;
}

.details-panel__calendar {
  margin-top: 32px;
  padding-top: 28px;
  border-top: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.details-panel__rsvp {
  margin-top: 32px;
  padding-top: 28px;
  border-top: 1px solid var(--line);
}

.details-panel__rsvp h2 {
  font-family: var(--display);
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 18px;
}

.field-label {
  display: block;
  font-size: 0.86rem;
  font-weight: 600;
  margin-bottom: 6px;
}

.rsvp-fields {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}

.detail-link {
  color: var(--blue);
  font-weight: 600;
}

.detail-link:hover {
  text-decoration: underline;
}

.calendar-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.calendar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 11px 18px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--paper);
  color: var(--ink);
  font-size: 0.9rem;
  font-weight: 600;
  transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.calendar-btn:hover {
  border-color: rgba(var(--blue-rgb), 0.28);
  background: var(--blue-soft);
  color: var(--blue);
}

.event-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 28px;
}

.event-nav-btn {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 88px;
  padding: 18px 22px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--white);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease, background 0.2s ease;
}

.event-nav-btn:hover {
  border-color: rgba(var(--blue-rgb), 0.3);
  background: var(--blue-soft);
  box-shadow: 0 8px 24px rgba(var(--blue-rgb), 0.1);
  transform: translateY(-2px);
}

.event-nav-btn--next {
  justify-content: flex-end;
  text-align: right;
}

.event-nav-btn--empty {
  visibility: hidden;
  pointer-events: none;
}

.event-nav-arrow {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: var(--paper);
  border: 1px solid var(--line);
  color: var(--blue);
  font-size: 1.1rem;
  font-weight: 700;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.event-nav-btn:hover .event-nav-arrow {
  background: var(--blue);
  border-color: var(--blue);
  color: var(--white);
}

.event-nav-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.event-nav-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.event-nav-title {
  font-family: var(--display);
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--ink);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.event-nav-date {
  font-size: 0.86rem;
  color: var(--blue);
  font-weight: 600;
}

@media (max-width: 960px) {
  .event-hero__head {
    flex-direction: column;
    align-items: flex-start;
  }

  .event-hero__actions {
    align-items: flex-start;
    width: 100%;
  }

  .event-hero__copy h1 {
    max-width: none;
  }

  .details-panel {
    padding: 24px;
  }

  .details-panel__grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .rsvp-fields {
    grid-template-columns: 1fr;
  }

  .event-nav {
    grid-template-columns: 1fr;
  }

  .event-nav-btn--empty {
    display: none;
  }

  .event-nav-btn--next {
    justify-content: flex-start;
    text-align: left;
  }
}
</style>
