<script setup lang="ts">
import pastorsPhoto from '~/assets/css/images/pastorspictures.jpeg'

const props = defineProps<{data: any}>()

const {data: team} = await useAsyncData('about-pastors', () =>
  queryCollection('team').order('order', 'ASC').all(),
)

const photoSrc = computed(() => props.data?.photoUrl || pastorsPhoto)
</script>

<template>
  <section id="pastors" class="block block-tight pastors">
    <div class="wrap">
      <div class="pastors-intro reveal">
        <div class="pastors-photo">
          <img
            :src="photoSrc"
            :alt="data.photoAlt || 'Pastors Emmanuel and Elizabeth Ojuolape'"
            width="320"
            height="400"
            loading="lazy"
          >
        </div>
        <div class="pastors-copy">
          <span v-if="data.eyebrow" class="eyebrow-dark">{{ data.eyebrow }}</span>
          <h2 class="pastors-title">{{ data.heading || 'Our Pastors' }}</h2>
          <p v-if="data.subheading" class="subheading">{{ data.subheading }}</p>
          <p v-if="data.role" class="role">{{ data.role }}</p>
        </div>
      </div>

      <div class="bios">
        <article v-for="person in team" :key="person.name" class="bio-card reveal">
          <h3>{{ person.name }}</h3>
          <p v-if="person.role" class="bio-role">{{ person.role }}</p>
          <div v-if="person.bio" class="bio-body">
            <p v-for="(para, i) in person.bio.split('\n\n')" :key="i">{{ para }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pastors-intro {
  display: flex;
  gap: 36px;
  align-items: flex-start;
  margin-bottom: 48px;
}
.pastors-photo {
  flex-shrink: 0;
  width: min(240px, 38vw);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--line);
  box-shadow: 0 8px 24px rgba(26, 26, 26, 0.06);
}
.pastors-photo img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  object-position: center top;
  aspect-ratio: 4 / 5;
}
.pastors-copy {
  flex: 1;
  min-width: 0;
  padding-top: 4px;
}
.pastors-title {
  font-family: var(--display);
  font-weight: 800;
  font-size: clamp(1.6rem, 3.5vw, 2.2rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-top: 8px;
}
.subheading {
  font-family: var(--display);
  font-weight: 700;
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  margin-top: 10px;
  color: var(--ink-2);
}
.role {
  color: var(--blue);
  font-weight: 600;
  font-size: 0.95rem;
  margin-top: 8px;
}
.bios {
  display: grid;
  gap: 24px;
}
.bio-card {
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 32px;
}
.bio-card h3 {
  font-family: var(--display);
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 4px;
}
.bio-role {
  color: var(--blue);
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 16px;
}
.bio-body p {
  color: var(--muted);
  font-size: 0.98rem;
  line-height: 1.65;
}
.bio-body p + p { margin-top: 14px; }
@media (max-width: 640px) {
  .pastors-intro {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .pastors-photo {
    width: min(200px, 55vw);
  }
}
</style>
