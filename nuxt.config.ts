export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n'
  ],

  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'it',
    locales: [
      {
        code: 'it',
        name: 'Italiano',
        language: 'it-IT'
      },
      {
        code: 'en',
        name: 'English',
        language: 'en-US'
      }
    ],
    detectBrowserLanguage: false,
    vueI18n: 'i18n.config.ts'
  },

  ssr: true,

  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      failOnError: false
    }
  },

  runtimeConfig: {
    strapiToken: '',
    strapiComponentsEndpoint: 'content-type-builder/components',
    strapiEnumsEndpoint: 'utils/enums/lang',

    public: {
      strapiUrl: '',
      siteUrl: '',
      defaultLocale: 'it'
    }
  },

  devtools: {
    enabled: true
  }
})