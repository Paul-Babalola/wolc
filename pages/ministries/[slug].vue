<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const {data: ministry} = await useAsyncData(`ministry-${slug}`, async () => {
  const result = await queryCollection('ministries').where('slug', '=', slug).first()
  return result ?? null
})

const {data: settings} = await useAsyncData(`ministry-settings-${slug}`, async () => {
  const result = await queryCollection('settings').first()
  return result ?? null
})

if (!ministry.value) {
  throw createError({statusCode: 404, statusMessage: 'Ministry not found', fatal: true})
}

const crumbs = computed(() => [
  {label: 'Home', href: '/'},
  {label: 'Ministries', href: '/ministries'},
  {label: ministry.value?.title || 'Ministry'},
])

const contactPhone = computed(() => settings.value?.phone || '301-637-0122')
const smsHref = computed(() => {
  if (!ministry.value?.contactKeyword) return null
  const digits = contactPhone.value.replace(/\D/g, '')
  return `sms:+1${digits}?body=${encodeURIComponent(ministry.value.contactKeyword)}`
})

useSiteSeo({
  title: () => ministry.value?.title,
  description: () => ministry.value?.blurb,
  image: () => ministry.value?.imageUrl,
})
</script>

<template>
  <div>
    <PageHeader
      :title="ministry?.title || 'Ministry'"
      :image="ministry?.imageUrl"
      :crumbs="crumbs"
    />

    <section class="block block-tight">
      <div class="wrap">
        <NuxtLink to="/ministries" class="back-link">← All ministries</NuxtLink>

        <article class="ministry-body reveal">
          <p v-if="ministry?.comingSoon" class="coming-soon-note">
            We are updating this page. Call or email the church office and we will point you in the right direction.
          </p>

          <blockquote v-if="ministry?.quote" class="ministry-quote">
            <p>{{ ministry.quote }}</p>
            <cite v-if="ministry.quoteRef">{{ ministry.quoteRef }}</cite>
          </blockquote>

          <p v-if="ministry?.blurb && !ministry?.body?.length" class="ministry-lead">
            {{ ministry.blurb }}
          </p>

          <div v-if="ministry?.body?.length" class="ministry-copy">
            <p v-for="(para, i) in ministry.body" :key="i">{{ para }}</p>
          </div>

          <p v-if="ministry?.meetingInfo && !ministry?.comingSoon" class="meet-pill">
            {{ ministry.meetingInfo }}
          </p>

          <div v-if="ministry?.contactKeyword || ministry?.comingSoon" class="ministry-actions">
            <a
              v-if="smsHref"
              :href="smsHref"
              class="btn btn-primary"
            >
              Text "{{ ministry.contactKeyword }}" to {{ contactPhone }}
            </a>
            <NuxtLink to="/contact" class="btn btn-ghost-dark">Contact the church</NuxtLink>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ministry-body {
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 40px;
  max-width: none;
}

.coming-soon-note {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  color: var(--ink-2);
  font-size: 0.96rem;
  margin-bottom: 24px;
}

.ministry-quote {
  border-left: 3px solid var(--blue);
  padding-left: 24px;
  margin-bottom: 32px;
  color: var(--ink-2);
}

.ministry-quote p {
  font-family: var(--display);
  font-weight: 600;
  font-size: 1.15rem;
  line-height: 1.55;
  white-space: pre-line;
}

.ministry-quote cite {
  display: block;
  margin-top: 12px;
  font-style: normal;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--blue);
  letter-spacing: 0.04em;
}

.ministry-lead {
  color: var(--ink-2);
  font-size: 1.12rem;
  line-height: 1.65;
  margin-bottom: 8px;
}

.ministry-copy p {
  color: var(--muted);
  font-size: 1.05rem;
  line-height: 1.7;
}

.ministry-copy p + p { margin-top: 18px; }

.meet-pill {
  display: inline-block;
  background: var(--blue-soft);
  color: var(--blue);
  font-weight: 600;
  font-size: 0.88rem;
  padding: 8px 16px;
  border-radius: 999px;
  margin-top: 28px;
}

.ministry-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 36px;
  padding-top: 28px;
  border-top: 1px solid var(--line);
}

@media (max-width: 560px) {
  .ministry-body { padding: 28px 24px; }
}
</style>
