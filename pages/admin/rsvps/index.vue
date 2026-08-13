<script setup lang="ts">
definePageMeta({layout: 'admin'})

interface EventRsvp {
  id: string
  event_id: string
  name: string
  email: string
  guests: number
  created_at: string
  events: {
    title: string
    starts_at: string
    slug: string
  } | null
}

interface RecurringRsvp {
  id: string
  event_key: string
  slug: string
  starts_at: string
  name: string
  email: string
  guests: number
  created_at: string
}

const tab = ref<'recurring' | 'custom'>('recurring')

const {data: recurring, pending: recurringPending, error: recurringError, refresh: refreshRecurring} =
  await useFetch<RecurringRsvp[]>('/api/admin/recurring-rsvps', {default: () => []})

const {data: custom, pending: customPending, error: customError, refresh: refreshCustom} =
  await useFetch<EventRsvp[]>('/api/admin/rsvps', {default: () => []})

function refreshAll() {
  refreshRecurring()
  refreshCustom()
}

function exportRecurringCsv() {
  const rows = [
    ['Event', 'When', 'Name', 'Email', 'Guests', 'Submitted'],
    ...(recurring.value || []).map((item) => [
      item.slug,
      formatAdminWhen(item.starts_at),
      item.name,
      item.email,
      String(item.guests),
      formatAdminWhen(item.created_at),
    ]),
  ]
  downloadCsv('wolc-recurring-rsvps.csv', rows)
}

function exportCustomCsv() {
  const rows = [
    ['Event', 'When', 'Name', 'Email', 'Guests', 'Submitted'],
    ...(custom.value || []).map((item) => [
      item.events?.title || 'Event',
      formatAdminWhen(item.events?.starts_at),
      item.name,
      item.email,
      String(item.guests),
      formatAdminWhen(item.created_at),
    ]),
  ]
  downloadCsv('wolc-event-rsvps.csv', rows)
}

useSiteSeo({title: 'RSVPs', description: 'Staff RSVP management.', noindex: true})
</script>

<template>
  <div class="admin-page">
    <div class="admin-page-head">
      <div>
        <h1>RSVPs</h1>
        <p class="admin-page-lead">
          Registrations for recurring Bible Study and Sunday Service appear under recurring RSVPs.
          Custom one-off events appear under event RSVPs.
        </p>
      </div>
      <div class="admin-page-actions">
        <button class="btn btn-ghost-dark" type="button" @click="refreshAll">Refresh</button>
      </div>
    </div>

    <div class="admin-tabs">
      <button class="admin-tab" :class="{active: tab === 'recurring'}" type="button" @click="tab = 'recurring'">
        Recurring
      </button>
      <button class="admin-tab" :class="{active: tab === 'custom'}" type="button" @click="tab = 'custom'">
        Custom events
      </button>
    </div>

    <section v-if="tab === 'recurring'" class="admin-panel">
      <div class="admin-panel-head">
        <h2>Recurring RSVPs</h2>
        <div class="admin-page-actions">
          <span class="admin-count">{{ recurring?.length || 0 }}</span>
          <button class="btn btn-ghost-dark" type="button" @click="exportRecurringCsv">Export CSV</button>
        </div>
      </div>

      <p v-if="recurringError" class="admin-error">Could not load recurring RSVPs.</p>
      <p v-else-if="recurringPending" class="admin-empty">Loading…</p>
      <p v-else-if="!recurring?.length" class="admin-empty">No recurring RSVPs yet.</p>

      <ul v-else class="admin-list">
        <li v-for="item in recurring" :key="item.id" class="admin-list-item">
          <div>
            <div class="admin-list-title-row">
              <h3>{{ item.name }}</h3>
              <span class="admin-pill info">{{ item.slug }}</span>
            </div>
            <p class="admin-meta">{{ item.email }} · {{ item.guests }} guest{{ item.guests === 1 ? '' : 's' }}</p>
            <p class="admin-meta">Service: {{ formatAdminWhen(item.starts_at) }}</p>
            <p class="admin-meta">Submitted: {{ formatAdminWhen(item.created_at) }}</p>
          </div>
        </li>
      </ul>
    </section>

    <section v-else class="admin-panel">
      <div class="admin-panel-head">
        <h2>Custom event RSVPs</h2>
        <div class="admin-page-actions">
          <span class="admin-count">{{ custom?.length || 0 }}</span>
          <button class="btn btn-ghost-dark" type="button" @click="exportCustomCsv">Export CSV</button>
        </div>
      </div>

      <p v-if="customError" class="admin-error">Could not load event RSVPs.</p>
      <p v-else-if="customPending" class="admin-empty">Loading…</p>
      <p v-else-if="!custom?.length" class="admin-empty">No custom event RSVPs yet.</p>

      <ul v-else class="admin-list">
        <li v-for="item in custom" :key="item.id" class="admin-list-item">
          <div>
            <div class="admin-list-title-row">
              <h3>{{ item.name }}</h3>
              <span v-if="item.events" class="admin-pill info">{{ item.events.title }}</span>
            </div>
            <p class="admin-meta">{{ item.email }} · {{ item.guests }} guest{{ item.guests === 1 ? '' : 's' }}</p>
            <p v-if="item.events" class="admin-meta">When: {{ formatAdminWhen(item.events.starts_at) }}</p>
            <p class="admin-meta">Submitted: {{ formatAdminWhen(item.created_at) }}</p>
            <NuxtLink
              v-if="item.events"
              class="admin-link"
              :to="`/events/${item.events.slug}`"
              target="_blank"
            >
              View event
            </NuxtLink>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
