<script setup lang="ts">
const {data: settings} = await useAsyncData('visit-settings', () =>
  queryCollection('settings').first(),
)

const mapEmbed = computed(() => {
  const q = encodeURIComponent(settings.value?.address || '11313 Lockwood Dr, Silver Spring MD 20904')
  return `https://maps.google.com/maps?q=${q}&output=embed`
})

const highlights = [
  {
    label: 'Service time',
    value: 'Sundays at 10:00 AM',
    detail: 'Plan for about two hours of worship, prayer, and the Word.',
    icon: 'clock',
  },
  {
    label: 'Location',
    value: 'Silver Spring, MD',
    detail: '11313 Lockwood Dr — free parking on site.',
    icon: 'pin',
  },
  {
    label: 'Families',
    value: 'Children welcome',
    detail: 'Covenant Seed ministry cares for kids during the service.',
    icon: 'family',
  },
]

const steps = [
  {
    title: 'Look for the welcome team',
    body: 'When you arrive, a team member at the door will help you find a seat and answer any questions.',
  },
  {
    title: 'Come as you are',
    body: 'There is no dress code and no pressure. We are glad you came — just be yourself.',
  },
  {
    title: 'Worship with us',
    body: 'Our service includes praise, prayer, and a Bible-based message. Most Sundays run about two hours.',
  },
  {
    title: 'Bring the whole family',
    body: 'Children are welcome in our Covenant Seed ministry so parents can worship with peace of mind.',
  },
]

useSeoMeta({
  title: 'Plan a Visit',
  description: 'What to expect on your first Sunday at RCCG Word of Life Center in Silver Spring, MD.',
})
</script>

<template>
  <div>
    <PageHeader
      title="Plan a Visit"
      :crumbs="[{label: 'Home', href: '/'}, {label: 'Plan a Visit'}]"
      lead="Join us this Sunday at 10:00 AM. We would love to meet you and help your first visit feel simple and welcoming."
    />

    <section class="block block-tight">
      <div class="wrap">
        <div class="visit-info-rail reveal">
          <article v-for="item in highlights" :key="item.label" class="info-cell">
            <div class="info-cell__icon" aria-hidden="true">
              <svg v-if="item.icon === 'clock'" width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6" />
                <path d="M12 8v4.5l2.5 1.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              </svg>
              <svg v-else-if="item.icon === 'pin'" width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" stroke="currentColor" stroke-width="1.6" />
                <circle cx="12" cy="11" r="2.2" stroke="currentColor" stroke-width="1.6" />
              </svg>
              <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="9" r="3" stroke="currentColor" stroke-width="1.6" />
                <circle cx="16.5" cy="10" r="2.5" stroke="currentColor" stroke-width="1.6" />
                <path d="M4.5 19.5c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                <path d="M14 19.5c0-1.8 1.4-3.2 3.2-3.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              </svg>
            </div>
            <div class="info-cell__content">
              <p class="info-cell__label">{{ item.label }}</p>
              <p class="info-cell__value">{{ item.value }}</p>
              <p class="info-cell__detail">{{ item.detail }}</p>
            </div>
          </article>
        </div>

        <div class="visit-body reveal">
          <div class="visit-expect">
            <span class="eyebrow-dark">First time?</span>
            <h2>What to expect</h2>
            <ol class="expect-list">
              <li v-for="(step, i) in steps" :key="i">
                <span class="expect-num">{{ String(i + 1).padStart(2, '0') }}</span>
                <div>
                  <h3>{{ step.title }}</h3>
                  <p>{{ step.body }}</p>
                </div>
              </li>
            </ol>
          </div>

          <aside class="visit-aside">
            <div class="aside-card">
              <p class="aside-label">Before you come</p>
              <ul class="aside-list">
                <li>Doors open before 10:00 AM</li>
                <li>Free parking in the church lot</li>
                <li>Wednesday Bible Study at 7:00 PM</li>
              </ul>
              <a
                v-if="settings?.liveStreamUrl"
                :href="settings.liveStreamUrl"
                class="aside-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch a service online first →
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section class="block visit-map-section">
      <div class="wrap visit-map-grid">
        <div class="visit-map-copy reveal">
          <span class="eyebrow-dark">Location</span>
          <h2>Find us</h2>
          <p class="visit-address">{{ settings?.address }}</p>
          <p class="visit-times">{{ settings?.serviceTimes }}</p>
          <div class="visit-actions">
            <a
              v-if="settings?.mapUrl"
              :href="settings.mapUrl"
              class="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get directions →
            </a>
            <NuxtLink to="/contact" class="btn btn-ghost-dark">
              Contact us
            </NuxtLink>
          </div>
        </div>
        <div class="visit-map-frame reveal">
          <iframe
            :src="mapEmbed"
            title="Church location map"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.visit-info-rail {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: linear-gradient(180deg, var(--white) 0%, rgba(var(--blue-rgb), 0.02) 100%);
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(var(--blue-rgb), 0.07);
  margin-bottom: 56px;
}
.info-cell {
  display: flex;
  gap: 18px;
  align-items: flex-start;
  padding: 34px 30px;
  border-right: 1px solid var(--line);
  position: relative;
}
.info-cell:last-child { border-right: none; }
.info-cell::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--blue);
  opacity: 0;
  transition: opacity 0.2s ease;
}
.info-cell:hover::before { opacity: 1; }
.info-cell__icon {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 15px;
  background: var(--blue-soft);
  color: var(--blue);
  display: grid;
  place-items: center;
}
.info-cell__label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 8px;
}
.info-cell__value {
  font-family: var(--display);
  font-weight: 700;
  font-size: clamp(1.2rem, 2.2vw, 1.45rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--ink);
  margin-bottom: 10px;
}
.info-cell__detail {
  color: var(--muted);
  font-size: 0.94rem;
  line-height: 1.55;
  max-width: 28ch;
}

.visit-body {
  display: grid;
  grid-template-columns: 1.35fr 0.85fr;
  gap: 40px;
  align-items: start;
}
.visit-expect h2 {
  font-family: var(--display);
  font-weight: 700;
  font-size: clamp(1.6rem, 3vw, 2rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 10px 0 28px;
}
.expect-list {
  list-style: none;
  display: grid;
  gap: 22px;
}
.expect-list li {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 18px;
  align-items: start;
  padding-bottom: 22px;
  border-bottom: 1px solid var(--line);
}
.expect-list li:last-child {
  padding-bottom: 0;
  border-bottom: none;
}
.expect-num {
  font-family: var(--display);
  font-weight: 800;
  font-size: 0.9rem;
  color: var(--blue);
  background: var(--blue-soft);
  border-radius: 10px;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
}
.expect-list h3 {
  font-family: var(--display);
  font-weight: 700;
  font-size: 1.08rem;
  margin-bottom: 6px;
  color: var(--ink);
}
.expect-list p {
  color: var(--muted);
  font-size: 0.98rem;
  line-height: 1.6;
}

.aside-card {
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 28px 26px;
  position: sticky;
  top: calc(var(--nav-offset) + 16px);
}
.aside-label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 14px;
}
.aside-list {
  list-style: none;
  display: grid;
  gap: 12px;
  margin-bottom: 20px;
}
.aside-list li {
  position: relative;
  padding-left: 18px;
  color: var(--ink-2);
  font-size: 0.96rem;
  line-height: 1.5;
}
.aside-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.62em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--blue);
}
.aside-link {
  color: var(--blue);
  font-weight: 600;
  font-size: 0.92rem;
}
.aside-link:hover { text-decoration: underline; }

.visit-map-section {
  padding-top: 0;
  background: var(--white);
  border-top: 1px solid var(--line);
}
.visit-map-grid {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 40px;
  align-items: center;
}
.visit-map-copy h2 {
  font-family: var(--display);
  font-weight: 700;
  font-size: clamp(1.6rem, 3vw, 2rem);
  line-height: 1.1;
  margin: 10px 0 16px;
}
.visit-address,
.visit-times {
  color: var(--muted);
  line-height: 1.6;
}
.visit-times {
  margin-top: 8px;
  font-weight: 600;
  color: var(--ink-3);
}
.visit-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}
.visit-map-frame {
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--line);
  min-height: 360px;
  background: var(--paper);
}
.visit-map-frame iframe {
  width: 100%;
  height: 100%;
  min-height: 360px;
  border: 0;
  display: block;
}

@media (max-width: 900px) {
  .visit-info-rail { grid-template-columns: 1fr; }
  .info-cell {
    border-right: none;
    border-bottom: 1px solid var(--line);
    padding: 28px 24px;
  }
  .info-cell:last-child { border-bottom: none; }
  .visit-body,
  .visit-map-grid { grid-template-columns: 1fr; }
  .aside-card { position: static; }
}
</style>
