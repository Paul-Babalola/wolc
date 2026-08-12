// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: {enabled: true},

  modules: ['@nuxt/content', '@nuxtjs/supabase', '@nuxt/image'],

  css: ['~/assets/css/main.css'],

  image: {
    domains: ['images.unsplash.com', 'i.ytimg.com', 'i1.ytimg.com', 'i2.ytimg.com', 'rccgwolc.org'],
  },

  runtimeConfig: {
    adminEmails: process.env.ADMIN_EMAILS || '',
    resendApiKey: process.env.RESEND_API_KEY || '',
    notifyEmail: process.env.NOTIFY_EMAIL || 'admin@rccgwordoflifecenter.org',
    notifyFrom: process.env.NOTIFY_FROM || 'Word of Life Center <onboarding@resend.dev>',
    youtubeChannelId: process.env.YOUTUBE_CHANNEL_ID || 'UCG3ywTSflHliywZLUHeyETA',
  },

  app: {
    head: {
      link: [
        {rel: 'icon', type: 'image/png', href: '/rccglogo.png'},
        {rel: 'apple-touch-icon', href: '/rccglogo.png'},
        {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: ''},
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600&display=swap',
        },
      ],
    },
  },

  content: {
    preview: {
      api: 'https://api.nuxt.studio',
    },
  },

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: ['/admin/**'],
      exclude: ['/login', '/confirm'],
    },
  },

  routeRules: {
    '/': {prerender: true},
    '/prayer-request': {redirect: '/prayer'},
    '/about': {prerender: true},
    '/visit': {prerender: true},
    '/give': {prerender: true},
    '/leadership': {prerender: true},
    '/contact': {prerender: true},
    '/livestream': {prerender: true},
    '/prayer': {prerender: true},
    '/membership': {prerender: true},
    '/ministries/**': {isr: 3600},
    '/sermons/**': {isr: 3600},
    '/events/**': {isr: 300},
    '/admin/**': {ssr: false},
    '/login': {ssr: false},
  },
})
