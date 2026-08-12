<script setup lang="ts">
const {data: settings} = await useAsyncData('give-settings', () =>
  queryCollection('settings').first(),
)

const zelleEmail = computed(() => settings.value?.email || 'admin@rccgwordoflifecenter.org')

const methods = computed(() => [
  {
    id: 'zelle',
    title: 'Zelle',
    payee: 'Redeemed Christian Church of God',
    email: zelleEmail.value,
    icon: 'wallet',
  },
  {
    id: 'paypal',
    title: 'PayPal',
    body:
      'Simple and secure platform for single gifts or recurring giving using your checking account, debit, or credit card. Setting up an account helps you gain access to a giving report at the end of each financial year.',
    action: {
      label: 'Give now',
      href: 'https://www.paypal.com/donate/?hosted_button_id=E49YRWWV6Q8ZW',
      external: true,
    },
    icon: 'card',
  },
  {
    id: 'text',
    title: 'Text to Give',
    body:
      'Text to Give uses industry-leading security to protect your personal information and is never charged to your phone bill. Text “Give” to (240) 775-2009 and follow the prompts to give. You have the option to register your card one time.',
    icon: 'message',
  },
  {
    id: 'person',
    title: 'In Person',
    body:
      'You can give in person at any of our weekend worship experiences. You can give with a check, cash, and/or via a debit card. Simply fill out the giving envelope provided in the worship guide and drop it in the offering basket as it is passed.',
    icon: 'church',
  },
  {
    id: 'mail',
    title: 'Mail',
    body:
      'Want to mail in your gift personally? Please make checks payable to RCCG WOLC, and address all donations to:',
    address: [
      'RCCG Word of Life Center',
      '4040 Blackburn Lane #150',
      'Burtonsville MD 20866',
    ],
    icon: 'mail',
  },
])

useSeoMeta({
  title: 'Give',
  description: 'Partner with RCCG Word of Life Center through Zelle, PayPal, text, in person, or mail.',
})
</script>

<template>
  <div>
    <PageHeader
      title="Give"
      accent="blue"
      :crumbs="[{label: 'Home', href: '/'}, {label: 'Give'}]"
    />

    <section class="block block-tight">
      <div class="wrap">
        <div class="give-intro reveal">
          <h2>Ways to Give</h2>
          <p>
            To make giving simple, convenient, and secure, we created several options you can explore.
          </p>
        </div>

        <div class="give-grid reveal">
          <article v-for="method in methods" :key="method.id" class="give-card">
            <div class="give-card__icon" aria-hidden="true">
              <svg v-if="method.icon === 'wallet'" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="6" width="18" height="13" rx="2.5" stroke="currentColor" stroke-width="1.6" />
                <path d="M3 10h18" stroke="currentColor" stroke-width="1.6" />
                <circle cx="16.5" cy="14" r="1.2" fill="currentColor" />
              </svg>
              <svg v-else-if="method.icon === 'card'" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="2.5" y="5" width="19" height="14" rx="2.5" stroke="currentColor" stroke-width="1.6" />
                <path d="M2.5 9.5h19" stroke="currentColor" stroke-width="1.6" />
                <path d="M6.5 15.5h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              </svg>
              <svg v-else-if="method.icon === 'message'" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 6.5h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
              </svg>
              <svg v-else-if="method.icon === 'church'" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 3v4.5M8.5 7.5 12 4l3.5 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                <path d="M6 9.5h12v10H6z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
                <path d="M10 19.5v-5h4v5" stroke="currentColor" stroke-width="1.6" />
              </svg>
              <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="6" width="18" height="13" rx="2.5" stroke="currentColor" stroke-width="1.6" />
                <path d="m3 8 9 6 9-6" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
              </svg>
            </div>

            <h3>{{ method.title }}</h3>

            <p v-if="method.payee" class="give-card__body">
              {{ method.payee }} (email:
              <a :href="`mailto:${method.email}`" class="give-card__link">{{ method.email }}</a>)
            </p>
            <p v-else-if="method.body" class="give-card__body">{{ method.body }}</p>

            <address v-if="method.address" class="give-card__address">
              <span v-for="line in method.address" :key="line">{{ line }}</span>
            </address>

            <NuxtLink
              v-if="method.action && !method.action.external"
              :to="method.action.href"
              class="btn give-card__cta"
            >
              {{ method.action.label }} →
            </NuxtLink>
            <a
              v-else-if="method.action?.external"
              :href="method.action.href"
              class="btn give-card__cta"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ method.action.label }} →
            </a>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.give-intro {
  max-width: 640px;
  margin-bottom: 40px;
}

.give-intro h2 {
  font-family: var(--display);
  font-size: clamp(1.8rem, 3.5vw, 2.4rem);
  margin-bottom: 12px;
}

.give-intro p {
  color: var(--muted);
  font-size: 1.05rem;
}

.give-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.give-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 34px 28px 30px;
  box-shadow: 0 10px 36px rgba(var(--blue-rgb), 0.05);
}

.give-card__icon {
  width: 58px;
  height: 58px;
  border-radius: 16px;
  background: var(--blue-soft);
  color: var(--blue);
  display: grid;
  place-items: center;
  margin-bottom: 18px;
}

.give-card h3 {
  font-family: var(--display);
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 14px;
}

.give-card__body {
  color: var(--muted);
  font-size: 0.98rem;
  line-height: 1.65;
  margin-bottom: 18px;
}

.give-card__link {
  color: var(--blue);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.give-card__address {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-style: normal;
  color: var(--ink);
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: 18px;
}

.give-card__cta {
  margin-top: auto;
  background: transparent;
  color: var(--blue);
  border: 1.5px solid var(--blue);
  box-shadow: none;
}

.give-card__cta:hover {
  background: var(--blue-soft);
  border-color: var(--blue-hover);
  color: var(--blue-hover);
  transform: translateY(-2px);
}

.give-card:last-child:nth-child(odd) {
  grid-column: 1 / -1;
  max-width: 560px;
  justify-self: center;
  width: 100%;
}

@media (max-width: 820px) {
  .give-grid {
    grid-template-columns: 1fr;
  }

  .give-card:last-child:nth-child(odd) {
    grid-column: auto;
    max-width: none;
  }
}
</style>
