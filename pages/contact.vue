<script setup lang="ts">
const {data: settings} = await useAsyncData('contact-settings', () =>
  queryCollection('settings').first(),
)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: '',
  website: '',
})

const state = ref<'idle' | 'sending' | 'done' | 'error'>('idle')
const errorMsg = ref('')

async function submit() {
  state.value = 'sending'
  errorMsg.value = ''
  const name = `${form.firstName} ${form.lastName}`.trim()
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        kind: 'contact',
        name,
        email: form.email,
        subject: form.subject || undefined,
        message: form.message,
        website: form.website || undefined,
      },
    })
    state.value = 'done'
  } catch (e: any) {
    state.value = 'error'
    errorMsg.value = e?.statusMessage || 'Something went wrong. Please try again.'
  }
}

const {images} = useSiteImages()

useSiteSeo({
  title: 'Contact',
  description: 'Get connected with RCCG Word of Life Center in Silver Spring, MD.',
  image: () => images.value.contact,
})
</script>

<template>
  <div>
    <PageHeader
      title="Get Connected"
      :image="images.contact"
      :crumbs="[{label: 'Home', href: '/'}, {label: 'Contact'}]"
    />

    <section class="block block-tight">
      <div class="wrap">
        <div class="connect-highlights reveal">
          <div class="highlight-card">
            <p class="highlight-label">Opening hours</p>
            <p class="highlight-value">Mon – Fri · 8:00 AM – 8:00 PM</p>
          </div>
          <div class="highlight-card">
            <p class="highlight-label">Give us a call</p>
            <p class="highlight-value">
              <a v-if="settings?.phone" :href="`tel:${settings.phone}`">{{ settings.phone }}</a>
            </p>
          </div>
        </div>

        <div class="contact-grid reveal">
          <aside class="find-us">
            <h2>How to find us</h2>
            <div class="find-block">
              <p class="find-label">Our address</p>
              <p class="find-value">{{ settings?.address }}</p>
            </div>
            <div class="find-block">
              <p class="find-label">Email us</p>
              <p class="find-value">
                <a v-if="settings?.email" :href="`mailto:${settings.email}`">{{ settings.email }}</a>
              </p>
            </div>
            <div class="find-block">
              <p class="find-label">Worship with us</p>
              <p class="find-value">Sunday at 10:00 AM</p>
            </div>
            <div class="find-block">
              <p class="find-label">Call us</p>
              <p class="find-value">
                <a v-if="settings?.phone" :href="`tel:${settings.phone}`">{{ settings.phone }}</a>
              </p>
            </div>
            <a
              v-if="settings?.mapUrl"
              :href="settings.mapUrl"
              class="btn btn-ghost-dark map-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get directions →
            </a>
          </aside>

          <div class="form-panel">
            <h2>Write to us</h2>
            <template v-if="state !== 'done'">
              <form class="form-stack" @submit.prevent="submit">
                <div class="form-honeypot" aria-hidden="true">
                  <label for="contact-website">Website</label>
                  <input
                    id="contact-website"
                    v-model="form.website"
                    type="text"
                    name="website"
                    tabindex="-1"
                    autocomplete="off"
                  >
                </div>
                <div class="form-row">
                  <label class="field-block">
                    <span class="field-label">First name</span>
                    <input
                      v-model="form.firstName"
                      class="form-field"
                      type="text"
                      name="firstName"
                      autocomplete="given-name"
                      required
                    >
                  </label>
                  <label class="field-block">
                    <span class="field-label">Last name</span>
                    <input
                      v-model="form.lastName"
                      class="form-field"
                      type="text"
                      name="lastName"
                      autocomplete="family-name"
                      required
                    >
                  </label>
                </div>
                <label class="field-block">
                  <span class="field-label">Email address</span>
                  <input
                    v-model="form.email"
                    class="form-field"
                    type="email"
                    name="email"
                    autocomplete="email"
                    required
                  >
                </label>
                <label class="field-block">
                  <span class="field-label">Subject</span>
                  <input v-model="form.subject" class="form-field" type="text" name="subject">
                </label>
                <label class="field-block">
                  <span class="field-label">Your message</span>
                  <textarea
                    v-model="form.message"
                    class="form-field"
                    name="message"
                    rows="6"
                    required
                  />
                </label>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="state === 'sending' || !form.firstName || !form.lastName || !form.email || !form.message"
                >
                  {{ state === 'sending' ? 'Sending…' : 'Submit form →' }}
                </button>
                <p v-if="state === 'error'" class="status-err">{{ errorMsg }}</p>
              </form>
            </template>
            <p v-else class="status-ok">Thank you! We'll be in touch soon.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.connect-highlights {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 40px;
  max-width: 640px;
}
.highlight-card {
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 22px 24px;
}
.highlight-label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 6px;
}
.highlight-value {
  font-family: var(--display);
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--ink);
}
.highlight-value a { color: var(--blue); }
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 40px;
  align-items: start;
}
.find-us h2,
.form-panel h2 {
  font-family: var(--display);
  font-weight: 700;
  font-size: 1.35rem;
  margin-bottom: 24px;
}
.find-block {
  margin-bottom: 22px;
}
.find-label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 4px;
}
.find-value {
  color: var(--ink-2);
  font-size: 0.98rem;
  line-height: 1.5;
}
.find-value a { color: var(--blue); font-weight: 500; }
.map-link { margin-top: 8px; }
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.field-block {
  display: block;
}
.field-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 6px;
}
@media (max-width: 900px) {
  .contact-grid { grid-template-columns: 1fr; }
  .connect-highlights { max-width: none; }
}
@media (max-width: 560px) {
  .connect-highlights,
  .form-row { grid-template-columns: 1fr; }
}
</style>
