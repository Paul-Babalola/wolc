type SiteSeoOptions = {
  title: string
  description: string
  image?: string
  noindex?: boolean
}

export function useSiteSeo(options: SiteSeoOptions) {
  const config = useRuntimeConfig()
  const route = useRoute()
  const siteUrl = String(config.public.siteUrl || 'https://rccgwolc.org').replace(/\/$/, '')
  const pageUrl = `${siteUrl}${route.path}`
  const defaultImage = `${siteUrl}/rccglogo.png`
  const image = options.image
    ? options.image.startsWith('http')
      ? options.image
      : `${siteUrl}${options.image.startsWith('/') ? '' : '/'}${options.image}`
    : defaultImage

  useSeoMeta({
    title: options.title,
    description: options.description,
    ogTitle: options.title,
    ogDescription: options.description,
    ogImage: image,
    ogUrl: pageUrl,
    ogType: 'website',
    ogSiteName: 'RCCG Word of Life Center',
    twitterCard: 'summary_large_image',
    twitterTitle: options.title,
    twitterDescription: options.description,
    twitterImage: image,
    robots: options.noindex ? 'noindex, nofollow' : 'index, follow',
  })

  useHead({
    link: [{rel: 'canonical', href: pageUrl}],
  })
}
