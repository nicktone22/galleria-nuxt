export default defineNuxtConfig({
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