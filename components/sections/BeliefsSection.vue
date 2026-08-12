<script setup lang="ts">
const props = defineProps<{data: any}>()

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
        <div v-if="galleryItems.length" class="gallery-wrap reveal">
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
            <article v-for="item in galleryItems" :key="item.label" class="beliefs-fallback__item">
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
.intro {
  color: var(--muted);
  margin-top: 16px;
  font-size: 1.05rem;
}
.gallery-wrap {
  width: 100%;
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
</style>
