type SiteSeoInput = {
  title: MaybeRefOrGetter<string | undefined>
  description: MaybeRefOrGetter<string | undefined>
  image?: MaybeRefOrGetter<string | undefined>
  noindex?: boolean
}

function resolveSeoValue(value: MaybeRefOrGetter<string | undefined>, fallback: string) {
  const resolved = toValue(value)
  return resolved?.trim() ? resolved.trim() : fallback
}

export function useSiteSeo(options: SiteSeoInput) {
  const config = useRuntimeConfig()
  const route = useRoute()
  const siteUrl = String(config.public.siteUrl || 'https://rccgwolc.org').replace(/\/$/, '')

  const title = computed(() => resolveSeoValue(options.title, 'RCCG Word of Life Center'))
  const description = computed(() =>
    resolveSeoValue(options.description, 'RCCG Word of Life Center in Silver Spring, Maryland.'),
  )
  const pageUrl = computed(() => `${siteUrl}${route.path}`)
  const defaultImage = `${siteUrl}/rccglogo.png`
  const image = computed(() => {
    const raw = toValue(options.image)
    if (!raw) return defaultImage
    return raw.startsWith('http')
      ? raw
      : `${siteUrl}${raw.startsWith('/') ? '' : '/'}${raw}`
  })

  useSeoMeta({
    title: () => title.value,
    description: () => description.value,
    ogTitle: () => title.value,
    ogDescription: () => description.value,
    ogImage: () => image.value,
    ogUrl: () => pageUrl.value,
    ogType: 'website',
    ogSiteName: 'RCCG Word of Life Center',
    twitterCard: 'summary_large_image',
    twitterTitle: () => title.value,
    twitterDescription: () => description.value,
    twitterImage: () => image.value,
    robots: options.noindex ? 'noindex, nofollow' : 'index, follow',
  })

  useHead({
    link: () => [{rel: 'canonical', href: pageUrl.value}],
  })
}
