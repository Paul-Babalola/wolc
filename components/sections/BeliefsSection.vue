<script setup lang="ts">
const props = defineProps<{ data: any }>()

const fallbackImage =
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80'

const galleryItems = computed(() =>
  (props.data?.items || []).map((item: any) => ({
    image: item.imageUrl || fallbackImage,
    label: item.title,
    description: item.body,
    alt: item.title,
  })),
)

const defaultIndex = computed(() =>
  Math.min(2, Math.max(galleryItems.value.length - 1, 0)),
)

const isMobile = ref(false)
let mobileQuery: MediaQueryList | undefined
let onMobileChange: ((event: MediaQueryListEvent) => void) | undefined

onMounted(() => {
  mobileQuery = window.matchMedia('(max-width: 768px)')
  const sync = () => {
    isMobile.value = mobileQuery?.matches ?? false
  }
  sync()
  onMobileChange = () => sync()
  mobileQuery.addEventListener('change', onMobileChange)
})

onBeforeUnmount(() => {
  if (mobileQuery && onMobileChange) {
    mobileQuery.removeEventListener('change', onMobileChange)
  }
})
</script>

<template>
  <section class="block beliefs">
    <div class="wrap">
      <div class="head reveal">
        <span v-if="data.eyebrow" class="eyebrow-dark">{{ data.eyebrow }}</span>
        <h2 class="section-title">{{ data.heading || 'What we believe' }}</h2>
        <p v-if="data.intro" class="intro">{{ data.intro }}</p>
      </div>

      <ClientOnly>
        <div v-if="isMobile && galleryItems.length" class="beliefs-mobile reveal">
          <article
            v-for="item in galleryItems"
            :key="item.label"
            class="beliefs-card"
          >
            <div class="beliefs-card__media">
              <img :src="item.image" :alt="item.alt" loading="lazy">
            </div>
            <div class="beliefs-card__body">
              <h3>{{ item.label }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </article>
        </div>

        <div v-else-if="galleryItems.length" class="gallery-wrap reveal">
          <BitsAccordionGallery
            :items="galleryItems"
            :default-index="defaultIndex"
            accent-color="#2563eb"
            overlay-color="#0f172a"
            text-color="#ffffff"
            :height="460"
            :expand-ratio="0.52"
            trigger="hover"
            :grayscale="true"
            :show-labels="true"
          />
        </div>

        <template #fallback>
          <div class="beliefs-fallback">
            <article
              v-for="item in galleryItems"
              :key="item.label"
              class="beliefs-fallback__item"
            >
              <h3>{{ item.label }}</h3>
              <p>{{ item.description }}</p>
            </article>
          </div>
        </template>
      </ClientOnly>
    </div>
  </section>
</template>

<style scoped>
.beliefs {
  background: var(--white);
}

.head {
  margin-bottom: 40px;
  max-width: 640px;
}

.section-title {
  color: var(--blue);
}

.intro {
  color: var(--muted);
  margin-top: 16px;
  font-size: 1.05rem;
}

.gallery-wrap {
  width: 100%;
}

.beliefs-mobile {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.beliefs-card {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 14px;
  align-items: start;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--paper);
}

.beliefs-card__media {
  width: 88px;
  height: 88px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.beliefs-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.beliefs-card__body h3 {
  font-family: var(--display);
  font-size: 1rem;
  line-height: 1.3;
  color: var(--ink);
  margin-bottom: 8px;
}

.beliefs-card__body p {
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.6;
}

.beliefs-fallback {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.beliefs-fallback__item {
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--paper);
}

.beliefs-fallback__item h3 {
  font-family: var(--display);
  font-size: 1.05rem;
  margin-bottom: 8px;
}

.beliefs-fallback__item p {
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.55;
}

@media (max-width: 420px) {
  .beliefs-card {
    grid-template-columns: 1fr;
  }

  .beliefs-card__media {
    width: 100%;
    height: 160px;
  }
}
</style>
