const defaults = {
  hero: '/images/site/homepage-hero.jpeg',
  aboutChurch: '/images/site/about-church.jpeg',
  pastors: '/images/site/pastors.jpeg',
  headerWorship: '/images/site/page-header-worship.jpeg',
  membership: '/images/site/membership.jpeg',
  livestream: '/images/site/page-header-livestream.jpg',
  contact: '/images/site/contact-sketch.png',
  ministries: '/images/site/page-header-ministries.jpg',
  visit: '/images/site/page-header-visit.jpg',
  sermons: '/images/site/page-header-sermons.jpg',
  connectGroup: '/images/site/page-header-connect-group.jpg',
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
