<script setup lang="ts">
const { currentLocale } = useCurrentLocale()
const config = useRuntimeConfig()

const noindex = String(config.public.noindex) === 'true'

useHead({
  title: 'Thetis Gallery',
  htmlAttrs: {
    lang: () => currentLocale.value
  },
  meta: noindex
    ? [{ name: 'robots', content: 'noindex, nofollow' }]
    : []
})
</script>

<template>
  <div>
    <SiteHeader />

    <NuxtPage />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

html {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #111;
  background: #fff;
}

body {
  margin: 0;
}

a {
  color: inherit;
}

img {
  display: block;
  max-width: 100%;
}
</style>