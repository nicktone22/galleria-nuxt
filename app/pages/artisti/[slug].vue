<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

const { find } = useStrapiApi()
const { getMediaUrl } = useStrapiMedia()

const slug = computed(() => String(route.params.slug || ''))

const currentLocale = computed(() => {
  return config.public.defaultLocale || 'it'
})

const { data, pending, error } = await useAsyncData(
  () => `artist-detail-${slug.value}-${currentLocale.value}`,
  () =>
    find<any>('artists', {
      locale: currentLocale.value,

      'filters[slug][$eq]': slug.value,

      'populate[media][populate]': '*',
      'populate[artworks][populate][media][populate]': '*',
      'populate[artworks][populate][artists][populate]': '*',
      'populate[exhibitions][populate]': '*',
      'populate[projects][populate]': '*'
    })
)

const artist = computed(() => {
  return data.value?.data?.[0] || null
})

function getArtistTitle(item: any) {
  return item?.name ||
    item?.title ||
    item?.attributes?.name ||
    item?.attributes?.title ||
    'Senza nome'
}

function getArtistImage(item: any) {
  if (!item) return null

  const media =
    item.media ||
    item.image ||
    item.portrait ||
    item.photo ||
    item.attributes?.media ||
    item.attributes?.image ||
    item.attributes?.portrait ||
    item.attributes?.photo

  return getMediaUrl(
    media?.file ||
    media?.image ||
    media?.media ||
    media?.upload ||
    media?.asset ||
    media
  )
}

function getText(value: any) {
  if (!value) return ''

  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value)) {
    return value
      .map((block) => {
        if (typeof block === 'string') return block

        if (Array.isArray(block.children)) {
          return block.children
            .map((child: any) => child.text || '')
            .join('')
        }

        return ''
      })
      .filter(Boolean)
      .join('\n')
  }

  return ''
}

function getRelationItems(value: any) {
  if (!value) return []

  if (Array.isArray(value)) return value

  if (Array.isArray(value.data)) return value.data

  if (value.data) return [value.data]

  return []
}

function getRelationTitle(item: any) {
  return item?.title ||
    item?.name ||
    item?.attributes?.title ||
    item?.attributes?.name ||
    'Senza titolo'
}

function getRelationSlug(item: any) {
  return item?.slug ||
    item?.attributes?.slug ||
    item?.documentId ||
    item?.id
}

function getArtworkImage(item: any) {
  if (!item) return null

  const media =
    item.media ||
    item.image ||
    item.featured_image ||
    item.attributes?.media ||
    item.attributes?.image ||
    item.attributes?.featured_image

  return getMediaUrl(
    media?.file ||
    media?.image ||
    media?.media ||
    media?.upload ||
    media?.asset ||
    media
  )
}

const bio = computed(() => {
  return getText(
    artist.value?.bio ||
    artist.value?.biography ||
    artist.value?.description ||
    artist.value?.descrizione ||
    artist.value?.content ||
    artist.value?.body
  )
})

const artworks = computed(() => {
  return getRelationItems(artist.value?.artworks)
})

const exhibitions = computed(() => {
  return getRelationItems(artist.value?.exhibitions)
})

const projects = computed(() => {
  return getRelationItems(artist.value?.projects)
})

useSeoMeta({
  title: () =>
    artist.value
      ? `${getArtistTitle(artist.value)} | Thetis Gallery`
      : 'Artista | Thetis Gallery',

  description: () =>
    bio.value
      ? bio.value.slice(0, 160)
      : 'Scheda artista della galleria.'
})
</script>

<template>
  <main class="page">
    <section v-if="pending" class="state">
      Caricamento artista...
    </section>

    <section v-else-if="error" class="state error">
      <h1>Errore nel caricamento</h1>
      <pre>{{ error?.message || error }}</pre>
    </section>

    <section v-else-if="!artist" class="state">
      <h1>Artista non trovato</h1>

      <NuxtLink to="/artisti" class="back-link">
        Torna agli artisti
      </NuxtLink>
    </section>

    <template v-else>
      <section class="artist-hero">
        <div class="artist-media">
          <img
            v-if="getArtistImage(artist)"
            :src="getArtistImage(artist) || ''"
            :alt="getArtistTitle(artist)"
          >

          <span v-else>
            Artista
          </span>
        </div>

        <div class="artist-info">
          <NuxtLink to="/artisti" class="back-link">
            ← Tutti gli artisti
          </NuxtLink>

          <p class="eyebrow">Artista</p>

          <h1>{{ getArtistTitle(artist) }}</h1>

          <div class="artist-stats">
            <div v-if="artworks.length">
              <strong>{{ artworks.length }}</strong>
              <span>Opere</span>
            </div>

            <div v-if="exhibitions.length">
              <strong>{{ exhibitions.length }}</strong>
              <span>Mostre</span>
            </div>

            <div v-if="projects.length">
              <strong>{{ projects.length }}</strong>
              <span>Progetti</span>
            </div>
          </div>

          <div v-if="bio" class="bio">
            <h2>Biografia</h2>
            <p>{{ bio }}</p>
          </div>
        </div>
      </section>

      <section v-if="artworks.length" class="content-section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Opere</p>
            <h2>Opere di {{ getArtistTitle(artist) }}</h2>
          </div>
        </div>

        <div class="artworks-grid">
          <article
            v-for="artwork in artworks"
            :key="artwork.documentId || artwork.id"
            class="artwork-card"
          >
            <NuxtLink
              :to="`/opere/${getRelationSlug(artwork)}`"
              class="artwork-link"
            >
              <div class="artwork-image">
                <img
                  v-if="getArtworkImage(artwork)"
                  :src="getArtworkImage(artwork) || ''"
                  :alt="getRelationTitle(artwork)"
                  loading="lazy"
                >

                <span v-else>
                  Opera
                </span>
              </div>

              <div class="artwork-content">
                <h3>{{ getRelationTitle(artwork) }}</h3>
              </div>
            </NuxtLink>
          </article>
        </div>
      </section>

      <section
        v-if="exhibitions.length || projects.length"
        class="content-section related-section"
      >
        <div v-if="exhibitions.length" class="relation-block">
          <h2>Mostre collegate</h2>

          <ul>
            <li
              v-for="exhibition in exhibitions"
              :key="exhibition.documentId || exhibition.id"
            >
              <NuxtLink :to="`/mostre/${getRelationSlug(exhibition)}`">
                {{ getRelationTitle(exhibition) }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div v-if="projects.length" class="relation-block">
          <h2>Progetti collegati</h2>

          <ul>
            <li
              v-for="project in projects"
              :key="project.documentId || project.id"
            >
              <NuxtLink :to="`/progetti/${getRelationSlug(project)}`">
                {{ getRelationTitle(project) }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </section>

      <details class="debug">
        <summary>Dati tecnici Strapi</summary>
        <pre>{{ artist }}</pre>
      </details>
    </template>
  </main>
</template>

<style scoped>
.page {
  max-width: 1440px;
  margin: 0 auto;
  padding: 72px 40px 96px;
}

.state {
  padding: 40px;
  border: 1px solid #eee;
  border-radius: 18px;
  background: #fafafa;
}

.state.error {
  color: #8a1f1f;
}

.state pre {
  white-space: pre-wrap;
}

.artist-hero {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(360px, 1.15fr);
  gap: 56px;
  align-items: start;
}

.artist-media {
  position: sticky;
  top: 104px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 520px;
  overflow: hidden;
  border-radius: 24px;
  background: #f7f7f7;
  color: #aaa;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.artist-media img {
  width: 100%;
  height: 100%;
  max-height: 720px;
  object-fit: cover;
}

.artist-info {
  padding-top: 8px;
}

.back-link {
  display: inline-flex;
  margin-bottom: 40px;
  color: #111;
  font-size: 15px;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
  text-underline-offset: 6px;
}

.eyebrow {
  margin: 0 0 12px;
  color: #777;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(52px, 8vw, 110px);
  line-height: 0.9;
  letter-spacing: -0.075em;
}

.artist-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 40px;
}

.artist-stats div {
  min-width: 120px;
  padding: 18px;
  border: 1px solid #eee;
  border-radius: 16px;
  background: #fafafa;
}

.artist-stats strong {
  display: block;
  font-size: 28px;
  line-height: 1;
}

.artist-stats span {
  display: block;
  margin-top: 8px;
  color: #777;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.bio {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid #eee;
}

.bio h2,
.relation-block h2 {
  margin: 0 0 16px;
  font-size: 15px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.bio p {
  margin: 0;
  color: #444;
  font-size: 18px;
  line-height: 1.65;
  white-space: pre-line;
}

.content-section {
  margin-top: 96px;
  padding-top: 56px;
  border-top: 1px solid #eee;
}

.section-heading {
  margin-bottom: 32px;
}

.section-heading h2 {
  margin: 0;
  font-size: clamp(32px, 4vw, 56px);
  line-height: 1;
  letter-spacing: -0.05em;
}

.artworks-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.artwork-card {
  overflow: hidden;
  border: 1px solid #e8e8e8;
  border-radius: 18px;
  background: #fff;
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.artwork-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
}

.artwork-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.artwork-image {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  color: #aaa;
  background: #f7f7f7;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.artwork-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.artwork-content {
  padding: 18px;
}

.artwork-content h3 {
  margin: 0;
  font-size: 20px;
  line-height: 1.15;
  letter-spacing: -0.03em;
}

.related-section {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 48px;
}

.relation-block ul {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.relation-block a {
  color: #111;
  font-size: 17px;
  text-decoration: none;
}

.relation-block a:hover {
  text-decoration: underline;
  text-underline-offset: 6px;
}

.debug {
  margin-top: 56px;
  padding-top: 24px;
  border-top: 1px solid #eee;
  color: #777;
  font-size: 13px;
}

.debug summary {
  cursor: pointer;
}

.debug pre {
  max-height: 360px;
  overflow: auto;
  margin: 16px 0 0;
  padding: 16px;
  border-radius: 12px;
  background: #f5f5f5;
  white-space: pre-wrap;
  font-size: 13px;
}

@media (max-width: 960px) {
  .artist-hero {
    grid-template-columns: 1fr;
  }

  .artist-media {
    position: relative;
    top: auto;
    min-height: auto;
    aspect-ratio: 4 / 3;
  }

  .related-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .page {
    padding: 48px 20px 72px;
  }

  .artworks-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .artworks-grid {
    grid-template-columns: 1fr;
  }
}
</style>