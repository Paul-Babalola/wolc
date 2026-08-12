<script setup lang="ts">
const {data: settings} = await useAsyncData('membership-settings', () =>
  queryCollection('settings').first(),
)

const steps = [
  {
    title: 'Worship with us',
    body: 'Come to Sunday service at 10:00 AM and get to know the church family.',
  },
  {
    title: 'Talk with a leader',
    body: 'Let us know you are interested in membership. A pastor or team member can answer your questions.',
  },
  {
    title: 'Complete membership',
    body: 'We will walk you through the RCCG membership process and help you take your next step.',
  },
]

useSeoMeta({
  title: 'Membership',
  description: 'Become part of the RCCG Word of Life Center church family in Silver Spring, MD.',
})
</script>

<template>
  <div>
    <PageHeader
      title="Membership"
      :crumbs="[{label: 'Home', href: '/'}, {label: 'Membership'}]"
    />

    <section class="block block-tight">
      <div class="wrap">
        <div class="membership-body reveal">
          <p class="membership-intro">
            RCCG Word of Life Center is a Bible-based, Jesus-focused congregation in Silver Spring, Maryland.
            If you would like to make this your church home, we would be glad to walk with you.
          </p>

          <ol class="membership-steps">
            <li v-for="step in steps" :key="step.title">
              <h2>{{ step.title }}</h2>
              <p>{{ step.body }}</p>
            </li>
          </ol>

          <div class="membership-actions">
            <NuxtLink to="/visit" class="btn btn-primary">Plan a visit</NuxtLink>
            <NuxtLink to="/contact" class="btn btn-ghost-dark">Contact us</NuxtLink>
            <a
              v-if="settings?.phone"
              :href="`tel:${settings.phone}`"
              class="btn btn-ghost-dark"
            >
              Call {{ settings.phone }}
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.membership-body {
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 40px;
  max-width: none;
}

.membership-intro {
  color: var(--muted);
  font-size: 1.05rem;
  line-height: 1.7;
  max-width: 62ch;
}

.membership-steps {
  list-style: none;
  counter-reset: step;
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.membership-steps li {
  counter-increment: step;
  padding-left: 44px;
  position: relative;
}

.membership-steps li::before {
  content: counter(step);
  position: absolute;
  left: 0;
  top: 2px;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: var(--blue-soft);
  color: var(--blue);
  font-size: 0.82rem;
  font-weight: 700;
  display: grid;
  place-items: center;
}

.membership-steps h2 {
  font-family: var(--display);
  font-size: 1.15rem;
  margin-bottom: 6px;
}

.membership-steps p {
  color: var(--muted);
  line-height: 1.65;
}

.membership-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 36px;
  padding-top: 28px;
  border-top: 1px solid var(--line);
}

@media (max-width: 560px) {
  .membership-body { padding: 28px 24px; }
}
</style>
