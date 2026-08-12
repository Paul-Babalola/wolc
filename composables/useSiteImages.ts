const defaults = {
  hero: '/images/site/homepage-hero.jpeg',
  aboutChurch: '/images/site/about-church.jpeg',
  pastors: '/images/site/pastors.jpeg',
  headerWorship: '/images/site/page-header-worship.jpeg',
  membership: '/images/site/membership.jpeg',
  livestream: '/images/site/livestream.jpeg',
  contact: '/images/site/contact-sketch.png',
  ministries: '/images/site/about-church.jpeg',
  visit: '/images/site/homepage-hero.jpeg',
  events: '/images/site/event-worship.jpg',
} as const

export type SiteImageKey = keyof typeof defaults

export function useSiteImages() {
  const settings = useNuxtData<{images?: Partial<Record<SiteImageKey, string>>}>('settings')

  const images = computed(() => ({
    ...defaults,
    ...settings.data.value?.images,
  }))

  return { images }
}
