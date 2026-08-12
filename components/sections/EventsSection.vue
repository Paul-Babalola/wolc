<script setup lang="ts">
const props = defineProps<{data: any}>()

const {data: events, refresh} = await useFetch('/api/events', {
  key: 'events-home-v3',
  query: {limit: props.data?.limit ?? 4},
  default: () => [],
})

onMounted(() => refresh())

function day(d: string) {
  return new Date(d).getDate()
}

function month(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
}

function weekday(d: string) {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'long' })
}

function time(d: string) {
  return new Date(d).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function eventHref(item: {id: string; slug: string; recurring?: boolean}) {
  return item.recurring ? `/events/${item.id}` : `/events/${item.slug}`
}
</script>

<template>
  <section class="events landing-section landing-section--paper">
    <div class="wrap">
      <SectionsSectionHeader
        class="reveal"
        :eyebrow="data.eyebrow"
        :title="data.heading"
        :intro="data.intro"
        action-label="Full calendar"
        action-href="/events"
      />

      <div v-if="events?.length" class="events-panel landing-surface reveal">
        <ClientOnly>
          <BitsFadeContent
            v-for="(e, index) in events"
            :key="e.id"
            :blur="true"
            :duration="800"
            ease="power2.out"
            :initial-opacity="0"
            :delay="index * 0.06"
            :threshold="0.15"
          >
            <NuxtLink :to="eventHref(e)" class="event-row">
              <div class="event-row__date">
                <span class="event-row__month">{{ month(e.starts_at) }}</span>
                <span class="event-row__day">{{ day(e.starts_at) }}</span>
              </div>

              <div class="event-row__main">
                <h3>{{ e.title }}</h3>
                <p v-if="e.summary">{{ e.summary }}</p>
                <span v-if="e.location" class="event-row__loc">{{ e.location }}</span>
              </div>

              <div class="event-row__meta">
                <span class="event-row__weekday">{{ weekday(e.starts_at) }}</span>
                <span class="event-row__time">{{ time(e.starts_at) }}</span>
              </div>
            </NuxtLink>
          </BitsFadeContent>

          <template #fallback>
            <NuxtLink
              v-for="e in events"
              :key="`${e.id}-fallback`"
              :to="eventHref(e)"
              class="event-row"
            >
              <div class="event-row__date">
                <span class="event-row__month">{{ month(e.starts_at) }}</span>
                <span class="event-row__day">{{ day(e.starts_at) }}</span>
              </div>
              <div class="event-row__main">
                <h3>{{ e.title }}</h3>
                <p v-if="e.summary">{{ e.summary }}</p>
              </div>
            </NuxtLink>
          </template>
        </ClientOnly>
      </div>

      <div v-else class="events-empty reveal">
        <p>No upcoming events right now. Check back soon or browse the full calendar.</p>
        <NuxtLink to="/events" class="btn btn-primary">View events</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.events :deep(.section-header) {
  margin-bottom: clamp(24px, 3.5vw, 36px);
}

.events-panel {
  overflow: hidden;
  padding: 8px;
}

.event-row {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr) auto;
  gap: clamp(18px, 3vw, 28px);
  align-items: center;
  padding: 22px 20px;
  border-radius: calc(var(--radius-lg) - 4px);
  transition: background 0.2s ease;
}

.event-row + .event-row {
  border-top: 1px solid var(--line);
}

.event-row:hover {
  background: rgba(var(--blue-rgb), 0.04);
}

.event-row__date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 72px;
  padding: 10px 8px;
  border-radius: 16px;
  background: var(--blue-soft);
  color: var(--blue);
}

.event-row__month {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.event-row__day {
  font-family: var(--display);
  font-size: 1.65rem;
  font-weight: 800;
  line-height: 1;
  margin-top: 2px;
}

.event-row__main h3 {
  font-family: var(--display);
  font-weight: 700;
  font-size: clamp(1.08rem, 2vw, 1.28rem);
  line-height: 1.2;
  margin-bottom: 6px;
}

.event-row__main p {
  color: var(--muted);
  font-size: 0.94rem;
  line-height: 1.5;
  max-width: 52ch;
}

.event-row__loc {
  display: inline-block;
  margin-top: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--blue);
}

.event-row__meta {
  text-align: right;
  min-width: 112px;
}

.event-row__weekday {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--ink-3);
}

.event-row__time {
  display: block;
  margin-top: 4px;
  font-size: 0.88rem;
  color: var(--muted);
}

.events-empty {
  text-align: center;
  padding: 48px 28px;
  border: 1px dashed var(--line);
  border-radius: var(--radius-xl);
  background: var(--white);
}

.events-empty p {
  color: var(--muted);
  margin-bottom: 20px;
}

@media (max-width: 820px) {
  .event-row {
    grid-template-columns: 72px minmax(0, 1fr);
  }

  .event-row__meta {
    grid-column: 2;
    text-align: left;
    min-width: 0;
  }
}
</style>
