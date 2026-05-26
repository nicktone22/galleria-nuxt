<script setup lang="ts">
const config = useRuntimeConfig()
const { find } = useStrapiApi()

const currentLocale = computed(() => {
  return config.public.defaultLocale || 'it'
})

const { data: artworksData } = await useAsyncData(
  () => `home-artworks-${currentLocale.value}`,
  () =>
    find<any>('artworks', {
      locale: currentLocale.value,

      'populate[media][populate]': '*',
      'populate[artists][populate]': '*',
      'populate[details][populate]': '*',

      'pagination[page]': 1,
      'pagination[pageSize]': 6,

      'sort[0]': 'createdAt:desc'
    })
)

const artworks = computed(() => {
  return (artworksData.value?.data || []).slice(0, 6)
})
</script>

<template>
  <main>
    <section class="hero">
      <p class="eyebrow">Contemporary Art Gallery</p>

      <h1>
        See the future of art
      </h1>

      <p class="hero-text">
        Il tuo tempo è limitato, quindi non sprecarlo vivendo la vita di qualcun altro.
        Non farti intrappolare dalle convenzioni, ma scopri la visione unica e la creatività dell'arte altrui.
      </p>

      <div class="hero-actions">
        <NuxtLink to="/opere" class="button primary">
          Esplora le opere
        </NuxtLink>

        <NuxtLink to="/artisti" class="button secondary">
          Vedi gli artisti
        </NuxtLink>
      </div>
    </section>

    <section class="section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">In evidenza</p>
          <h2>Ultime opere</h2>
        </div>

        <NuxtLink to="/opere" class="section-link">
          Tutte le opere
        </NuxtLink>
      </div>

      <div class="artworks-grid">
        <ArtworkCard
          v-for="artwork in artworks"
          :key="artwork.documentId || artwork.id"
          :artwork="artwork"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  min-height: 100vh;
}

.hero {
  padding: 96px 40px 80px;
  max-width: 1180px;
  margin: 0 auto;
}

.eyebrow {
  margin: 0 0 16px;
  color: #777;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1 {
  max-width: 980px;
  margin: 0;
  font-size: clamp(48px, 8vw, 104px);
  line-height: 0.95;
  letter-spacing: -0.07em;
}

.hero-text {
  max-width: 640px;
  margin: 32px 0 0;
  color: #555;
  font-size: 20px;
  line-height: 1.5;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 40px;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 22px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
}

.button.primary {
  color: #fff;
  background: #111;
}

.button.secondary {
  color: #111;
  border: 1px solid #ddd;
  background: #fff;
}

.section {
  padding: 72px 40px 96px;
  border-top: 1px solid #eee;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  max-width: 1180px;
  margin: 0 auto 32px;
}

.section-heading h2 {
  margin: 0;
  font-size: clamp(32px, 4vw, 56px);
  letter-spacing: -0.05em;
}

.section-link {
  color: #111;
  font-size: 15px;
  text-decoration: underline;
  text-underline-offset: 6px;
}

.artworks-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  max-width: 1180px;
  margin: 0 auto;
}

@media (max-width: 900px) {
  .artworks-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .hero,
  .section {
    padding-left: 20px;
    padding-right: 20px;
  }

  .artworks-grid {
    grid-template-columns: 1fr;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>