<script setup lang="ts">
definePageMeta({layout: 'admin'})

interface PrayerRequest {
  id: string
  name: string | null
  email: string | null
  message: string
  is_private: boolean
  handled_at: string | null
  created_at: string
}

const filter = ref<'all' | 'open' | 'private'>('all')
const updatingId = ref<string | null>(null)
const actionError = ref('')

const {data: requests, pending, error, refresh} = await useFetch<PrayerRequest[]>('/api/admin/prayer-requests', {
  default: () => [],
})

const filtered = computed(() => {
  const list = requests.value || []
  if (filter.value === 'open') return list.filter((item) => !item.handled_at)
  if (filter.value === 'private') return list.filter((item) => item.is_private)
  return list
})

async function toggleHandled(item: PrayerRequest) {
  updatingId.value = item.id
  actionError.value = ''

  try {
    await $fetch(`/api/admin/prayer-requests/${item.id}`, {
      method: 'PATCH',
      body: {handled: !item.handled_at},
    })
    await refresh()
  } catch (err: any) {
    actionError.value = err?.statusMessage || 'Could not update prayer request.'
  } finally {
    updatingId.value = null
  }
}

useSiteSeo({title: 'Prayer requests', description: 'Staff prayer request management.', noindex: true})
</script>

<template>
  <div class="admin-page">
    <div class="admin-page-head">
      <div>
        <h1>Prayer requests</h1>
        <p class="admin-page-lead">
          Review prayer requests submitted on the public site. Private requests are only visible here and in staff email notifications.
        </p>
      </div>
      <div class="admin-page-actions">
        <button class="btn btn-ghost-dark" type="button" @click="refresh()">Refresh</button>
      </div>
    </div>

    <div class="admin-tabs">
      <button class="admin-tab" :class="{active: filter === 'all'}" type="button" @click="filter = 'all'">All</button>
      <button class="admin-tab" :class="{active: filter === 'open'}" type="button" @click="filter = 'open'">Open</button>
      <button class="admin-tab" :class="{active: filter === 'private'}" type="button" @click="filter = 'private'">Private</button>
    </div>

    <section class="admin-panel">
      <div class="admin-panel-head">
        <h2>Requests</h2>
        <span class="admin-count">{{ filtered.length }}</span>
      </div>

      <p v-if="actionError" class="admin-error">{{ actionError }}</p>
      <p v-if="error" class="admin-error">Could not load prayer requests.</p>
      <p v-else-if="pending" class="admin-empty">Loading…</p>
      <p v-else-if="!filtered.length" class="admin-empty">No prayer requests in this view.</p>

      <ul v-else class="admin-list">
        <li v-for="item in filtered" :key="item.id" class="admin-list-item">
          <div>
            <div class="admin-list-title-row">
              <h3>{{ item.name || 'Anonymous' }}</h3>
              <span class="admin-pill" :class="item.handled_at ? 'muted' : 'warn'">
                {{ item.handled_at ? 'Handled' : 'Open' }}
              </span>
              <span v-if="item.is_private" class="admin-pill info">Private</span>
            </div>
            <p v-if="item.email" class="admin-meta">
              <a :href="`mailto:${item.email}`">{{ item.email }}</a>
            </p>
            <p class="admin-meta">Received: {{ formatAdminWhen(item.created_at) }}</p>
            <p class="admin-message">{{ item.message }}</p>
          </div>

          <div class="admin-actions-col">
            <button
              class="admin-text-btn"
              type="button"
              :disabled="updatingId === item.id"
              @click="toggleHandled(item)"
            >
              {{ updatingId === item.id ? 'Saving…' : item.handled_at ? 'Reopen' : 'Mark handled' }}
            </button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
