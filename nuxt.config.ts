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
    sources: [
      '/api/__sitemap__/urls',
    ],
  },
})