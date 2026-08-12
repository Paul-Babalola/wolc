<script setup lang="ts">
const {data: settings} = await useAsyncData('prayer-settings', () =>
  queryCollection('settings').first(),
)

const form = reactive({name: '', email: '', message: '', isPrivate: false, website: ''})
const state = ref<'idle' | 'sending' | 'done' | 'error'>('idle')
const errorMsg = ref('')

async function submit() {
  state.value = 'sending'
  errorMsg.value = ''
  try {
    await $fetch('/api/prayer', {method: 'POST', body: {...form}})
    state.value = 'done'
  } catch (e: any) {
    state.value = 'error'
    errorMsg.value = e?.statusMessage || 'Something went wrong. Please try again.'
  }
}

const {images} = useSiteImages()

useSeoMeta({
  title: 'Prayer Request',
  description: 'Share a prayer request with RCCG Word of Life Center.',
})
</script>

<template>
  <div>
    <PageHeader
      title="Prayer Request"
      :image="images.headerWorship"
      lead="We would like to pray with you. Kindly fill the form below."
      :crumbs="[{label: 'Home', href: '/'}, {label: 'Prayer Request'}]"
    />

    <section class="block block-tight">
      <div class="wrap">
        <div class="prayer-grid reveal">
          <aside class="prayer-aside">
            <h2>What happens next</h2>
            <ul>
              <li>Your request goes to our prayer team.</li>
              <li>Someone from the church will pray with you.</li>
              <li>We may follow up by phone or email if you leave contact details.</li>
            </ul>
            <p class="prayer-note">
              Check "Keep this private" if you only want the prayer team to see your request.
            </p>
            <p v-if="settings?.phone" class="prayer-phone">
              Prefer to call?
              <a :href="`tel:${settings.phone}`">{{ settings.phone }}</a>
            </p>
          </aside>

          <div class="form-panel">
            <template v-if="state !== 'done'">
              <form class="form-stack" @submit.prevent="submit">
                <div class="form-honeypot" aria-hidden="true">
                  <label for="prayer-website">Website</label>
                  <input
                    id="prayer-website"
                    v-model="form.website"
                    type="text"
                    name="website"
                    tabindex="-1"
                    autocomplete="off"
                  >
                </div>
                <label>
                  <span class="field-label">Name</span>
                  <input v-model="form.name" class="form-field" type="text" autocomplete="name">
                </label>
                <label>
                  <span class="field-label">Email</span>
                  <input v-model="form.email" class="form-field" type="email" autocomplete="email">
                </label>
                <label>
                  <span class="field-label">Prayer request</span>
                  <textarea v-model="form.message" class="form-field" rows="6" required />
                </label>
                <label class="form-check">
                  <input v-model="form.isPrivate" type="checkbox">
                  Keep this private to the prayer team
                </label>
                <button type="submit" class="btn btn-primary" :disabled="state === 'sending' || !form.message">
                  {{ state === 'sending' ? 'Sending…' : 'Submit request' }}
                </button>
                <p v-if="state === 'error'" class="status-err">{{ errorMsg }}</p>
              </form>
            </template>
            <p v-else class="status-ok">Thank you. Our team has received your request and will be praying.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.prayer-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 28px;
  align-items: start;
}

.prayer-aside h2 {
  font-family: var(--display);
  font-size: 1.35rem;
  margin-bottom: 16px;
}

.prayer-aside ul {
  list-style: disc;
  padding-left: 1.2rem;
  color: var(--muted);
  line-height: 1.7;
}

.prayer-aside li + li {
  margin-top: 10px;
}

.prayer-note,
.prayer-phone {
  margin-top: 20px;
  color: var(--muted);
  font-size: 0.96rem;
  line-height: 1.6;
}

.prayer-phone a {
  color: var(--blue);
  font-weight: 600;
}

.field-label {
  display: block;
  font-size: 0.88rem;
  font-weight: 600;
  margin-bottom: 6px;
}

@media (max-width: 820px) {
  .prayer-grid {
    grid-template-columns: 1fr;
  }
}
</style>
