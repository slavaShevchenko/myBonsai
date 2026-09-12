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

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      titleTemplate: '%s | Bonsai Shop',
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          name: 'description',
          content: 'Premium bonsai collection. Evergreen and deciduous specimens.',
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
      siteUrl: 'http://localhost:3000',
    },
  },

  site: {
    url: 'http://localhost:3000',
  },

  sitemap: {
    enabled: true,
    sources: [
      '/api/__sitemap__/urls',
    ],
  },
})