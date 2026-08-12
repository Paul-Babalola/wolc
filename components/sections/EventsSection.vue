<script setup lang="ts">
const props = defineProps<{data: any}>()

const {data: events, refresh} = await useFetch('/api/events', {
  key: 'events-home-v3',
  query: {limit: props.data?.limit ?? 4},
  default: () => [],
})

onMounted(() => refresh())

function day(d: string) { return new Date(d).toLocaleDateString('en-US', {day: '2-digit'}) }
function month(d: string) { return new Date(d).toLocaleDateString('en-US', {month: 'short'}) }
function when(d: string) {
  return new Date(d).toLocaleDateString('en-US', {weekday: 'short'}) + ' · ' +
    new Date(d).toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit'})
}

function eventHref(item: {id: string; slug: string; recurring?: boolean}) {
  return item.recurring ? `/events/${item.id}` : `/events/${item.slug}`
}
</script>

<template>
  <section class="block">
    <div class="wrap">
      <div class="m-head reveal">
        <div>
          <span v-if="data.eyebrow" class="eyebrow-dark">{{ data.eyebrow }}</span>
          <h2 class="section-title">{{ data.heading }}</h2>
        </div>
        <p v-if="data.intro">{{ data.intro }}</p>
      </div>

      <div v-if="events?.length" class="events-list">
        <NuxtLink v-for="e in events" :key="e.id" :to="eventHref(e)" class="event reveal">
          <div class="date">
            <span class="d">{{ day(e.starts_at) }}</span>
            <span class="m">{{ month(e.starts_at) }}</span>
          </div>
          <div class="info">
            <h4>{{ e.title }}</h4>
            <p>{{ e.summary }}</p>
          </div>
          <div class="when">{{ when(e.starts_at) }}</div>
        </NuxtLink>
      </div>
      <p v-else class="empty">No upcoming events right now. Check back soon.</p>
    </div>
  </section>
</template>

<style scoped>
.eyebrow-dark {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--blue);
  display: block;
  margin-bottom: 12px;
}
.m-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; margin-bottom: 52px; flex-wrap: wrap; }
.m-head p { color: var(--muted); max-width: 420px; }
.events-list { display: flex; flex-direction: column; border-top: 1px solid var(--line); }
.event {
  display: grid;
  grid-template-columns: 150px 1fr auto;
  gap: 28px;
  align-items: center;
  padding: 28px 8px;
  border-bottom: 1px solid var(--line);
  transition: background 0.2s;
}
.event:hover { background: var(--blue-soft); }
.date { font-family: var(--display); font-weight: 700; }
.date .d { font-size: 2rem; line-height: 1; display: block; color: var(--ink); }
.date .m { color: var(--blue); font-size: 0.85rem; letter-spacing: 0.12em; text-transform: uppercase; }
.info h4 { font-family: var(--display); font-weight: 600; font-size: 1.25rem; }
.info p { color: var(--muted); font-size: 0.94rem; margin-top: 3px; }
.when { color: var(--muted); font-size: 0.9rem; text-align: right; white-space: nowrap; }
.empty { color: var(--muted); }
@media (max-width: 900px) {
  .event { grid-template-columns: 90px 1fr; row-gap: 6px; }
  .when { grid-column: 2; text-align: left; }
}
</style>
