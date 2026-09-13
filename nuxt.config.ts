export default defineNuxtConfig({
  compatibilityDate: '2026-08-18',

  devtools: {
    enabled: true,
  },

  modules: [
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  alias: {
    '#/shared': './shared'
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      titleTemplate: '%s | My Bonsai',
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          name: 'description',
          content: 'Premium bonsai collection. Evergreen and deciduous specimens.',
        },
        {
          name: 'theme-color',
          content: '#ffffff',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        {
          rel: 'manifest',
          href: '/site.webmanifest',
        },
      ],
    },
  },

  runtimeConfig: {
    contentfulSpace: '',
    contentfulAccessToken: '',
    contentfulPreviewAccessToken: '',
    contentfulEnvironment: 'master',
    public: {
      siteUrl: 'https://my-bonsai.eu',
    },
  },

  site: {
    url: 'https://my-bonsai.eu',
  },

  sitemap: {
    enabled: true,
    autoLastmod: false,
    sources: [
      '/api/__sitemap__/urls',
    ],
  },
})