<script setup lang="ts">
definePageMeta({layout: 'admin'})

interface AdminEvent {
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
  capacity: number | null
  published: boolean
  created_at: string
}

const emptyForm = () => ({
  title: '',
  slug: '',
  slugTouched: false,
  starts_at: '',
  ends_at: '',
  location: '',
  summary: '',
  description: '',
  image_url: '',
  register_url: '',
  capacity: '',
  published: true,
})

const form = reactive(emptyForm())
const editingId = ref<string | null>(null)
const saving = ref(false)
const deletingId = ref<string | null>(null)
const formError = ref('')
const formSuccess = ref('')

const {data: events, pending, refresh, error: loadError} = await useFetch<AdminEvent[]>('/api/admin/events', {
  default: () => [],
})

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

watch(
  () => form.title,
  (title) => {
    if (!form.slugTouched && !editingId.value) {
      form.slug = slugify(title)
    }
  },
)

function toLocalInputValue(iso: string | null | undefined) {
  if (!iso) return ''
  const date = new Date(iso)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function fromLocalInputValue(value: string) {
  if (!value) return null
  return new Date(value).toISOString()
}

function resetForm() {
  Object.assign(form, emptyForm())
  editingId.value = null
  formError.value = ''
  formSuccess.value = ''
}

function startCreate() {
  resetForm()
}

function startEdit(event: AdminEvent) {
  editingId.value = event.id
  form.title = event.title
  form.slug = event.slug
  form.slugTouched = true
  form.starts_at = toLocalInputValue(event.starts_at)
  form.ends_at = toLocalInputValue(event.ends_at)
  form.location = event.location || ''
  form.summary = event.summary || ''
  form.description = event.description || ''
  form.image_url = event.image_url || ''
  form.register_url = event.register_url || ''
  form.capacity = event.capacity ? String(event.capacity) : ''
  form.published = event.published
  formError.value = ''
  formSuccess.value = ''
}

function buildPayload() {
  const startsAt = fromLocalInputValue(form.starts_at)
  if (!startsAt) throw new Error('Start date and time are required.')

  return {
    title: form.title.trim(),
    slug: form.slug.trim() || undefined,
    starts_at: startsAt,
    ends_at: fromLocalInputValue(form.ends_at),
    location: form.location.trim() || null,
    summary: form.summary.trim() || null,
    description: form.description.trim() || null,
    image_url: form.image_url.trim() || null,
    register_url: form.register_url.trim() || null,
    capacity: form.capacity ? Number(form.capacity) : null,
    published: form.published,
  }
}

async function saveEvent() {
  saving.value = true
  formError.value = ''
  formSuccess.value = ''

  try {
    const payload = buildPayload()

    if (editingId.value) {
      await $fetch(`/api/admin/events/${editingId.value}`, {
        method: 'PATCH',
        body: payload,
      })
      formSuccess.value = 'Event updated.'
    } else {
      await $fetch('/api/admin/events', {
        method: 'POST',
        body: payload,
      })
      formSuccess.value = 'Event created.'
      resetForm()
    }

    await refresh()
  } catch (error: any) {
    formError.value = error?.statusMessage || error?.message || 'Could not save event.'
  } finally {
    saving.value = false
  }
}

async function removeEvent(event: AdminEvent) {
  if (!confirm(`Delete “${event.title}”? This cannot be undone.`)) return

  deletingId.value = event.id
  formError.value = ''

  try {
    await $fetch(`/api/admin/events/${event.id}`, {method: 'DELETE'})
    if (editingId.value === event.id) resetForm()
    await refresh()
  } catch (error: any) {
    formError.value = error?.statusMessage || 'Could not delete event.'
  } finally {
    deletingId.value = null
  }
}

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))
}

useSiteSeo({title: 'Manage events', description: 'Staff event management.', noindex: true})
</script>

<template>
  <div class="admin-page">
    <div class="admin-page-head">
      <div>
        <h1>Events</h1>
        <p class="admin-page-lead">Add special one-off events to the public calendar. Bible Study and Sunday Service are generated automatically each week.</p>
      </div>
      <div class="admin-page-actions">
        <button class="btn btn-ghost-dark" type="button" @click="startCreate">New event</button>
      </div>
    </div>

    <div class="admin-grid">
      <section class="form-panel">
        <h2>{{ editingId ? 'Edit event' : 'Add event' }}</h2>

        <form class="form-stack" @submit.prevent="saveEvent">
          <label>
            <span class="field-label">Title</span>
            <input v-model="form.title" class="form-field" type="text" required maxlength="200">
          </label>

          <label>
            <span class="field-label">URL slug</span>
            <input
              v-model="form.slug"
              class="form-field"
              type="text"
              required
              maxlength="120"
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              @input="form.slugTouched = true"
            >
          </label>

          <div class="field-row">
            <label>
              <span class="field-label">Starts</span>
              <input v-model="form.starts_at" class="form-field" type="datetime-local" required>
            </label>
            <label>
              <span class="field-label">Ends (optional)</span>
              <input v-model="form.ends_at" class="form-field" type="datetime-local">
            </label>
          </div>

          <label>
            <span class="field-label">Location</span>
            <input v-model="form.location" class="form-field" type="text" maxlength="300">
          </label>

          <label>
            <span class="field-label">Summary</span>
            <textarea v-model="form.summary" class="form-field" rows="2" maxlength="500" />
          </label>

          <label>
            <span class="field-label">Description</span>
            <textarea v-model="form.description" class="form-field" rows="5" maxlength="10000" />
          </label>

          <div class="field-row">
            <label>
              <span class="field-label">Image URL</span>
              <input v-model="form.image_url" class="form-field" type="url">
            </label>
            <label>
              <span class="field-label">Registration URL</span>
              <input v-model="form.register_url" class="form-field" type="url">
            </label>
          </div>

          <label>
            <span class="field-label">Capacity (optional)</span>
            <input v-model="form.capacity" class="form-field" type="number" min="1">
          </label>

          <label class="form-check">
            <input v-model="form.published" type="checkbox">
            <span>Published on the public site</span>
          </label>

          <p v-if="formError" class="admin-error">{{ formError }}</p>
          <p v-if="formSuccess" class="admin-success">{{ formSuccess }}</p>

          <div class="form-actions">
            <button class="btn btn-primary" type="submit" :disabled="saving">
              {{ saving ? 'Saving…' : editingId ? 'Save changes' : 'Create event' }}
            </button>
            <button
              v-if="editingId"
              class="btn btn-ghost-dark"
              type="button"
              @click="resetForm"
            >
              Cancel edit
            </button>
          </div>
        </form>
      </section>

      <section class="admin-panel list-panel">
        <div class="admin-panel-head">
          <h2>Saved events</h2>
          <span class="admin-count">{{ events?.length || 0 }}</span>
        </div>

        <p v-if="loadError" class="admin-error">Could not load events. Check Supabase configuration.</p>
        <p v-else-if="pending" class="admin-empty">Loading…</p>
        <p v-else-if="!events?.length" class="admin-empty">No custom events yet.</p>

        <ul v-else class="admin-list">
          <li v-for="event in events" :key="event.id" class="admin-list-item">
            <div>
              <div class="admin-list-title-row">
                <h3>{{ event.title }}</h3>
                <span class="admin-pill" :class="event.published ? '' : 'muted'">
                  {{ event.published ? 'Published' : 'Draft' }}
                </span>
              </div>
              <p class="admin-meta">{{ formatWhen(event.starts_at) }}</p>
              <p v-if="event.location" class="admin-meta">{{ event.location }}</p>
              <p v-if="event.summary" class="admin-message">{{ event.summary }}</p>
              <NuxtLink class="admin-link" :to="`/events/${event.slug}`" target="_blank">
                /events/{{ event.slug }}
              </NuxtLink>
            </div>

            <div class="admin-actions-col">
              <button class="admin-text-btn" type="button" @click="startEdit(event)">Edit</button>
              <button
                class="admin-text-btn danger"
                type="button"
                :disabled="deletingId === event.id"
                @click="removeEvent(event)"
              >
                {{ deletingId === event.id ? 'Deleting…' : 'Delete' }}
              </button>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.field-label {
  display: block;
  font-size: 0.88rem;
  font-weight: 600;
  margin-bottom: 6px;
}

.field-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (max-width: 960px) {
  .field-row {
    grid-template-columns: 1fr;
  }
}
</style>
