<script setup lang="ts">
import logoUrl from '~/assets/css/images/logo.png'

const props = defineProps<{settings?: any}>()

const usefulLinks = computed(() => [
  {label: 'About', href: '/about', external: false},
  {label: 'Livestream', href: '/livestream', external: false},
  {label: 'Membership', href: '/membership', external: false},
  {label: 'Prayer Request', href: '/prayer', external: false},
  {label: 'Contact', href: '/contact', external: false},
])

const ministryLinks = [
  {label: 'Children', href: '/ministries/children'},
  {label: 'Youth', href: '/ministries/youth'},
  {label: 'Women of Grace', href: '/ministries/women'},
  {label: 'Men of Valor', href: '/ministries/men'},
]

const addressLines = computed(() => {
  const address = props.settings?.address || ''
  const parts = address.split(',').map((s: string) => s.trim()).filter(Boolean)
  if (parts.length >= 2) {
    return [`${parts[0]}.`, parts.slice(1).join(', ')]
  }
  return address ? [address] : []
})

const subscribeEmail = ref('')
const subscribeState = ref<'idle' | 'sending' | 'done' | 'error'>('idle')

async function onSubscribe() {
  const email = subscribeEmail.value.trim()
  if (!email) return
  subscribeState.value = 'sending'
  try {
    await $fetch('/api/newsletter', {method: 'POST', body: {email}})
    subscribeState.value = 'done'
    subscribeEmail.value = ''
  } catch {
    subscribeState.value = 'error'
  }
}
</script>

<template>
  <footer id="visit-footer" class="foot">
    <div class="wrap foot-grid">
      <div class="foot-brand">
        <NuxtLink to="/" class="foot-logo" aria-label="Word of Life Center — home">
          <img :src="logoUrl" alt="RCCG Word of Life Center" width="200" height="36">
        </NuxtLink>

        <div class="foot-contact">
          <p v-for="(line, i) in addressLines" :key="i" class="foot-contact-line">{{ line }}</p>
          <a v-if="settings?.phone" :href="`tel:${settings.phone}`" class="foot-contact-line foot-phone">
            {{ settings.phone }}
          </a>
        </div>

        <div v-if="settings?.socials?.length" class="foot-socials">
          <a
            v-for="s in settings.socials"
            :key="s.url"
            :href="s.url"
            :aria-label="s.platform"
            class="foot-social"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg v-if="s.platform === 'YouTube'" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12 9.6 15.6Z" />
            </svg>
            <svg v-else-if="s.platform === 'Instagram'" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4A5.8 5.8 0 0 1 16.2 22H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6m5.2-3.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4" />
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.2-1.5 1.6-1.5H17V4.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V11H8v3h2.3v8h3.2Z" />
            </svg>
          </a>
        </div>
      </div>

      <div class="foot-col">
        <h3 class="foot-heading">Useful Links</h3>
        <nav aria-label="Useful links">
          <template v-for="link in usefulLinks" :key="link.href">
            <a
              v-if="link.external"
              :href="link.href"
              class="foot-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ link.label }}
            </a>
            <NuxtLink v-else :to="link.href" class="foot-link">{{ link.label }}</NuxtLink>
          </template>
        </nav>
      </div>

      <div class="foot-col">
        <h3 class="foot-heading">Ministries</h3>
        <nav aria-label="Ministries">
          <NuxtLink v-for="link in ministryLinks" :key="link.href" :to="link.href" class="foot-link">
            {{ link.label }}
          </NuxtLink>
        </nav>
      </div>

      <div class="foot-col foot-subscribe">
        <h3 class="foot-heading">Join Our Email List</h3>
        <form class="foot-subscribe-form" @submit.prevent="onSubscribe">
          <input
            v-model="subscribeEmail"
            type="email"
            name="email"
            autocomplete="email"
            placeholder="Email address"
            class="foot-email-input"
            :disabled="subscribeState === 'done'"
            required
          >
          <button type="submit" class="foot-subscribe-btn" :disabled="subscribeState === 'sending' || subscribeState === 'done'">
            {{ subscribeState === 'done' ? 'Subscribed!' : subscribeState === 'sending' ? 'Subscribing…' : 'Subscribe' }}
          </button>
          <p v-if="subscribeState === 'error'" class="foot-subscribe-msg err">Something went wrong. Try again.</p>
        </form>
      </div>
    </div>

    <div class="foot-bottom">
      <div class="wrap">
        <p class="foot-copy">© {{ new Date().getFullYear() }} RCCG Word of Life Center · A parish of RCCG North America</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.foot {
  width: 100%;
  background: var(--white);
}

.foot-grid {
  display: grid;
  grid-template-columns: 1.35fr 0.85fr 0.85fr 1fr;
  gap: clamp(28px, 4vw, 48px);
  padding: 56px 28px 48px;
  align-items: start;
}

.foot-logo {
  display: inline-flex;
  transition: opacity 0.2s ease;
}

.foot-logo:hover {
  opacity: 0.85;
}

.foot-logo img {
  height: 40px;
  width: auto;
  max-width: 200px;
  object-fit: contain;
  object-position: left center;
}

.foot-contact {
  margin-top: 16px;
  display: grid;
  gap: 3px;
}

.foot-contact-line {
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.45;
  color: var(--blue);
}

.foot-phone {
  margin-top: 6px;
  transition: opacity 0.2s ease;
}

.foot-phone:hover {
  opacity: 0.75;
}

.foot-socials {
  display: flex;
  gap: 10px;
  margin-top: 22px;
}

.foot-social {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--blue);
  color: var(--white);
  display: grid;
  place-items: center;
  transition: background 0.2s ease, transform 0.2s ease;
}

.foot-social:hover {
  background: var(--blue-hover);
  transform: translateY(-2px);
}

.foot-heading {
  font-family: var(--display);
  font-weight: 700;
  font-size: 0.92rem;
  color: var(--blue);
  margin-bottom: 12px;
}

.foot-col nav {
  display: grid;
  gap: 8px;
}

.foot-link {
  width: fit-content;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--ink);
  transition: opacity 0.2s ease;
}

.foot-link:hover {
  opacity: 0.65;
}

.foot-subscribe-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 280px;
}

.foot-email-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--body);
  font-size: 0.82rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.foot-email-input::placeholder {
  color: var(--muted);
}

.foot-email-input:focus {
  outline: none;
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(var(--blue-rgb), 0.12);
}

.foot-subscribe-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: var(--blue);
  color: var(--white);
  font-family: var(--body);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.foot-subscribe-btn:hover {
  background: var(--blue-hover);
  transform: translateY(-1px);
}

.foot-subscribe-msg {
  font-size: 0.78rem;
  margin-top: -2px;
}

.foot-subscribe-msg.err {
  color: #c0392b;
}

.foot-bottom {
  background: var(--blue);
  padding: 14px 0;
}

.foot-copy {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.72);
  text-align: center;
}

@media (max-width: 960px) {
  .foot-grid {
    grid-template-columns: 1fr 1fr;
  }

  .foot-brand {
    grid-column: 1 / -1;
  }

  .foot-subscribe {
    grid-column: 1 / -1;
  }
}

@media (max-width: 560px) {
  .foot-grid {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 44px 28px 36px;
  }

  .foot-subscribe {
    grid-column: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .foot-social:hover,
  .foot-subscribe-btn:hover {
    transform: none;
  }
}
</style>
