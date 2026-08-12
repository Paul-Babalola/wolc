import {defineContentConfig, defineCollection, z} from '@nuxt/content'

const link = z.object({
  label: z.string().optional(),
  href: z.string().optional(),
  external: z.boolean().optional(),
})

const navItem = z.object({
  label: z.string(),
  href: z.string().optional(),
  external: z.boolean().optional(),
  highlight: z.boolean().optional(),
  children: z
    .array(
      z.object({
        label: z.string(),
        href: z.string(),
        description: z.string().optional(),
        external: z.boolean().optional(),
      }),
    )
    .optional(),
})

const heroSection = z.object({
  component: z.literal('hero'),
  eyebrow: z.string().optional(),
  badge: z.string().optional(),
  headline: z.string(),
  highlight: z.string().optional(),
  subtext: z.string().optional(),
  imageUrl: z.string().optional(),
  logoUrl: z.string().optional(),
  primaryCta: link.optional(),
  secondaryCta: link.optional(),
})

const quickInfoSection = z.object({
  component: z.literal('quickInfo'),
  tone: z.enum(['blue', 'green']).optional(),
  layout: z.enum(['strip', 'cards']).optional(),
  items: z.array(
    z.object({icon: z.string(), heading: z.string(), body: z.string()}),
  ),
})

const aboutSection = z.object({
  component: z.literal('about'),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  highlight: z.string().optional(),
  body: z.array(z.string()).optional(),
  cta: link.optional(),
  scriptureQuote: z.string().optional(),
  scriptureRef: z.string().optional(),
})

const ministriesSection = z.object({
  component: z.literal('ministries'),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  intro: z.string().optional(),
})

const sermonFeatureSection = z.object({
  component: z.literal('sermonFeature'),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  body: z.string().optional(),
  primaryCta: link.optional(),
  secondaryCta: link.optional(),
})

const eventsSection = z.object({
  component: z.literal('events'),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  intro: z.string().optional(),
  limit: z.number().default(4),
})

const ctaSection = z.object({
  component: z.literal('cta'),
  heading: z.string().optional(),
  body: z.string().optional(),
  primaryCta: link.optional(),
  secondaryCta: link.optional(),
})

const beliefsSection = z.object({
  component: z.literal('beliefs'),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  intro: z.string().optional(),
  items: z.array(z.object({
    title: z.string(),
    body: z.string(),
    imageUrl: z.string().optional(),
  })),
})

const pastorsSection = z.object({
  component: z.literal('pastors'),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  subheading: z.string().optional(),
  role: z.string().optional(),
  photoUrl: z.string().optional(),
  photoAlt: z.string().optional(),
})

const statementsSection = z.object({
  component: z.literal('statements'),
  items: z.array(
    z.object({
      eyebrow: z.string().optional(),
      heading: z.string(),
      body: z.array(z.string()),
    }),
  ),
})

const mapSection = z.object({
  component: z.literal('map'),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  address: z.string().optional(),
  serviceTimes: z.string().optional(),
  directionsUrl: z.string().optional(),
  embedUrl: z.string().optional(),
})

const section = z.discriminatedUnion('component', [
  heroSection,
  quickInfoSection,
  aboutSection,
  ministriesSection,
  sermonFeatureSection,
  eventsSection,
  ctaSection,
  beliefsSection,
  pastorsSection,
  statementsSection,
  mapSection,
])

const seo = z
  .object({title: z.string().optional(), description: z.string().optional()})
  .optional()

export default defineContentConfig({
  collections: {
    settings: defineCollection({
      type: 'data',
      source: 'settings.yml',
      schema: z.object({
        title: z.string(),
        subtitle: z.string().optional(),
        tagline: z.string().optional(),
        serviceTimes: z.string().optional(),
        address: z.string().optional(),
        mapUrl: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        paypalDonateUrl: z.string().url().optional(),
        liveStreamUrl: z.string().optional(),
        facebookLiveUrl: z.string().optional(),
        socials: z.array(z.object({platform: z.string(), url: z.string()})).optional(),
        primaryNav: z.array(navItem).optional(),
      }),
    }),

    pages: defineCollection({
      type: 'data',
      source: 'pages/*.yml',
      schema: z.object({
        slug: z.string(),
        title: z.string(),
        seo,
        sections: z.array(section),
      }),
    }),

    ministries: defineCollection({
      type: 'data',
      source: 'ministries/*.yml',
      schema: z.object({
        slug: z.string(),
        title: z.string(),
        icon: z.string().optional(),
        imageUrl: z.string().optional(),
        blurb: z.string().optional(),
        meetingInfo: z.string().optional(),
        order: z.number().optional(),
        body: z.array(z.string()).optional(),
        quote: z.string().optional(),
        quoteRef: z.string().optional(),
        comingSoon: z.boolean().optional(),
        contactKeyword: z.string().optional(),
      }),
    }),

    series: defineCollection({
      type: 'data',
      source: 'series/*.yml',
      schema: z.object({
        slug: z.string(),
        title: z.string(),
        description: z.string().optional(),
      }),
    }),

    sermons: defineCollection({
      type: 'page',
      source: 'sermons/*.md',
      schema: z.object({
        speaker: z.string().optional(),
        series: z.string().optional(),
        preachedAt: z.string().optional(),
        scripture: z.string().optional(),
        videoUrl: z.string().optional(),
        audioUrl: z.string().optional(),
      }),
    }),

    team: defineCollection({
      type: 'data',
      source: 'team/*.yml',
      schema: z.object({
        name: z.string(),
        role: z.string().optional(),
        bio: z.string().optional(),
        photoUrl: z.string().optional(),
        order: z.number().optional(),
      }),
    }),
  },
})
