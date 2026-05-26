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
  () => `project-detail-${slug.value}-${currentLocale.value}`,
  () =>
    find<any>('projects', {
      locale: currentLocale.value,

      'filters[slug][$eq]': slug.value,

      'populate[media][populate]': '*',
      'populate[artists][populate]': '*',
      'populate[artworks][populate][media][populate]': '*',
      'populate[artworks][populate][artists][populate]': '*',
      'populate[exhibitions][populate][media][populate]': '*'
      
    })
)

const project = computed(() => {
  return data.value?.data?.[0] || null
})

function getProjectTitle(item: any) {
  return item?.title ||
    item?.name ||
    item?.attributes?.title ||
    item?.attributes?.name ||
    'Senza titolo'
}

function getProjectImage(item: any) {
  if (!item) return null

  const media =
    item.media ||
    item.image ||
    item.cover ||
    item.featured_image ||
    item.attributes?.media ||
    item.attributes?.image ||
    item.attributes?.cover ||
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

function getExhibitionImage(item: any) {
  if (!item) return null

  const media =
    item.media ||
    item.image ||
    item.cover ||
    item.featured_image ||
    item.attributes?.media ||
    item.attributes?.image ||
    item.attributes?.cover ||
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

const description = computed(() => {
  return getText(
    project.value?.description ||
    project.value?.descrizione ||
    project.value?.content ||
    project.value?.body
  )
})

const artists = computed(() => {
  return getRelationItems(project.value?.artists)
})

const artworks = computed(() => {
  return getRelationItems(project.value?.artworks)
})

const exhibitions = computed(() => {
  return getRelationItems(project.value?.exhibitions)
})

const tags = computed(() => {
  return getRelationItems(project.value?.tags)
})

useSeoMeta({
  title: () =>
    project.value
      ? `${getProjectTitle(project.value)} | Thetis Gallery`
      : 'Progetto | Thetis Gallery',

  description: () =>
    description.value
      ? description.value.slice(0, 160)
      : 'Scheda progetto della galleria.'
})
</script>

<template>
  <main class="page">
    <section v-if="pending" class="state">
      Caricamento progetto...
    </section>

    <section v-else-if="error" class="state error">
      <h1>Errore nel caricamento</h1>
      <pre>{{ error?.message || error }}</pre>
    </section>

    <section v-else-if="!project" class="state">
      <h1>Progetto non trovato</h1>

      <NuxtLink to="/progetti" class="back-link">
        Torna ai progetti
      </NuxtLink>
    </section>

    <template v-else>
      <section class="project-hero">
        <div class="project-media">
          <img
            v-if="getProjectImage(project)"
            :src="getProjectImage(project) || ''"
            :alt="getProjectTitle(project)"
          >

          <span v-else>
            Progetto
          </span>
        </div>

        <div class="project-info">
          <NuxtLink to="/progetti" class="back-link">
            ← Tutti i progetti
          </NuxtLink>

          <p class="eyebrow">Progetto</p>

          <h1>{{ getProjectTitle(project) }}</h1>

          <div class="stats">
            <div v-if="artists.length">
              <strong>{{ artists.length }}</strong>
              <span>Artisti</span>
            </div>

            <div v-if="artworks.length">
              <strong>{{ artworks.length }}</strong>
              <span>Opere</span>
            </div>

            <div v-if="exhibitions.length">
              <strong>{{ exhibitions.length }}</strong>
              <span>Mostre</span>
            </div>
          </div>

          <div v-if="description" class="description">
            <h2>Descrizione</h2>
            <p>{{ description }}</p>
          </div>

          <div v-if="tags.length" class="tags-block">
            <h2>Tag</h2>

            <div class="tags">
              <span
                v-for="tag in tags"
                :key="tag.documentId || tag.id"
              >
                {{ getRelationTitle(tag) }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section v-if="artists.length" class="content-section">
        <div class="section-heading">
          <p class="eyebrow">Artisti</p>
          <h2>Artisti collegati</h2>
        </div>

        <ul class="relations-list">
          <li
            v-for="artist in artists"
            :key="artist.documentId || artist.id"
          >
            <NuxtLink :to="`/artisti/${getRelationSlug(artist)}`">
              {{ getRelationTitle(artist) }}
            </NuxtLink>
          </li>
        </ul>
      </section>

      <section v-if="artworks.length" class="content-section">
        <div class="section-heading">
          <p class="eyebrow">Opere</p>
          <h2>Opere collegate</h2>
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

      <section v-if="exhibitions.length" class="content-section">
        <div class="section-heading">
          <p class="eyebrow">Mostre</p>
          <h2>Mostre collegate</h2>
        </div>

        <div class="exhibitions-grid">
          <article
            v-for="exhibition in exhibitions"
            :key="exhibition.documentId || exhibition.id"
            class="exhibition-card"
          >
            <NuxtLink
              :to="`/mostre/${getRelationSlug(exhibition)}`"
              class="exhibition-link"
            >
              <div class="exhibition-image">
                <img
                  v-if="getExhibitionImage(exhibition)"
                  :src="getExhibitionImage(exhibition) || ''"
                  :alt="getRelationTitle(exhibition)"
                  loading="lazy"
                >

                <span v-else>
                  Mostra
                </span>
              </div>

              <div class="exhibition-content">
                <h3>{{ getRelationTitle(exhibition) }}</h3>
              </div>
            </NuxtLink>
          </article>
        </div>
      </section>

      <details class="debug">
        <summary>Dati tecnici Strapi</summary>
        <pre>{{ project }}</pre>
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

.project-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 1fr);
  gap: 56px;
  align-items: start;
}

.project-media {
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

.project-media img {
  width: 100%;
  height: 100%;
  max-height: 720px;
  object-fit: cover;
}

.project-info {
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
  font-size: clamp(48px, 7vw, 96px);
  line-height: 0.95;
  letter-spacing: -0.07em;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 40px;
}

.stats div {
  min-width: 120px;
  padding: 18px;
  border: 1px solid #eee;
  border-radius: 16px;
  background: #fafafa;
}

.stats strong {
  display: block;
  font-size: 28px;
  line-height: 1;
}

.stats span {
  display: block;
  margin-top: 8px;
  color: #777;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.description,
.tags-block {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid #eee;
}

.description h2,
.tags-block h2 {
  margin: 0 0 16px;
  font-size: 15px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.description p {
  margin: 0;
  color: #444;
  font-size: 18px;
  line-height: 1.65;
  white-space: pre-line;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tags span {
  display: inline-flex;
  padding: 7px 12px;
  border-radius: 999px;
  background: #f1f1f1;
  color: #555;
  font-size: 13px;
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

.relations-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.relations-list a {
  display: inline-flex;
  padding: 9px 15px;
  border: 1px solid #ddd;
  border-radius: 999px;
  color: #111;
  font-size: 15px;
  text-decoration: none;
}

.relations-list a:hover {
  border-color: #111;
}

.artworks-grid,
.exhibitions-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.artwork-card,
.exhibition-card {
  overflow: hidden;
  border: 1px solid #e8e8e8;
  border-radius: 18px;
  background: #fff;
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.artwork-card:hover,
.exhibition-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
}

.artwork-link,
.exhibition-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.artwork-image,
.exhibition-image {
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

.exhibition-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.artwork-content,
.exhibition-content {
  padding: 18px;
}

.artwork-content h3,
.exhibition-content h3 {
  margin: 0;
  font-size: 20px;
  line-height: 1.15;
  letter-spacing: -0.03em;
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
  .project-hero {
    grid-template-columns: 1fr;
  }

  .project-media {
    position: relative;
    top: auto;
    min-height: auto;
    aspect-ratio: 4 / 3;
  }
}

@media (max-width: 760px) {
  .page {
    padding: 48px 20px 72px;
  }

  .artworks-grid,
  .exhibitions-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .artworks-grid,
  .exhibitions-grid {
    grid-template-columns: 1fr;
  }
}
</style>