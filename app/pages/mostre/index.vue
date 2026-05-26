<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const { find } = useStrapiApi()
const { getMediaUrl } = useStrapiMedia()

const currentLocale = computed(() => {
  return config.public.defaultLocale || 'it'
})

const pageSize = 30

const currentPage = computed(() => {
  const page = Number(route.query.page || 1)
  return Number.isFinite(page) && page > 0 ? page : 1
})

const { data, pending, error } = await useAsyncData(
  () => `exhibitions-${currentLocale.value}-page-${currentPage.value}`,
  () =>
    find<any>('exhibitions', {
      locale: currentLocale.value,

      'populate[media][populate]': '*',
      'populate[artists][populate]': '*',
      'populate[artworks][populate][media][populate]': '*',
      'populate[projects][populate]': '*',

      'pagination[page]': currentPage.value,
      'pagination[pageSize]': pageSize,

      'sort[0]': 'createdAt:desc'
    }),
  {
    watch: [currentPage]
  }
)

const exhibitions = computed(() => {
  return (data.value?.data || []).slice(0, pageSize)
})

const pagination = computed(() => {
  return data.value?.meta?.pagination || {
    page: currentPage.value,
    pageSize,
    pageCount: 1,
    total: exhibitions.value.length
  }
})

const pageCount = computed(() => {
  return pagination.value.pageCount || 1
})

function getExhibitionTitle(exhibition: any) {
  return exhibition.title ||
    exhibition.name ||
    exhibition.attributes?.title ||
    exhibition.attributes?.name ||
    'Senza titolo'
}

function getExhibitionSlug(exhibition: any) {
  return exhibition.slug ||
    exhibition.attributes?.slug ||
    exhibition.documentId ||
    exhibition.id
}

function getExhibitionImage(exhibition: any) {
  const media =
    exhibition.media ||
    exhibition.image ||
    exhibition.cover ||
    exhibition.featured_image ||
    exhibition.attributes?.media ||
    exhibition.attributes?.image ||
    exhibition.attributes?.cover ||
    exhibition.attributes?.featured_image

  return getMediaUrl(
    media?.file ||
    media?.image ||
    media?.media ||
    media?.upload ||
    media?.asset ||
    media
  )
}

function getRelationCount(value: any) {
  if (!value) return 0

  if (Array.isArray(value)) return value.length
  if (Array.isArray(value.data)) return value.data.length

  return 0
}

function getDateLabel(exhibition: any) {
  const start =
    exhibition.start_date ||
    exhibition.startDate ||
    exhibition.date_start ||
    exhibition.attributes?.start_date ||
    exhibition.attributes?.startDate ||
    exhibition.attributes?.date_start

  const end =
    exhibition.end_date ||
    exhibition.endDate ||
    exhibition.date_end ||
    exhibition.attributes?.end_date ||
    exhibition.attributes?.endDate ||
    exhibition.attributes?.date_end

  if (start && end) return `${start} — ${end}`
  if (start) return start
  if (end) return end

  return ''
}

function goToPage(page: number) {
  if (page < 1 || page > pageCount.value) return

  router.push({
    path: '/mostre',
    query: {
      ...route.query,
      page: page > 1 ? String(page) : undefined
    }
  })
}

useSeoMeta({
  title: 'Mostre | Thetis Gallery',
  description: 'Archivio mostre della galleria.'
})
</script>

<template>
  <main class="page">
    <section class="page-heading">
      <p class="eyebrow">Archivio</p>
      <h1>Mostre</h1>

      <p class="summary">
        {{ pagination.total }} mostre trovate.
      </p>
    </section>

    <section v-if="pending" class="state">
      Caricamento mostre...
    </section>

    <section v-else-if="error" class="state error">
      <h2>Errore nel caricamento</h2>
      <pre>{{ error?.message || error }}</pre>
    </section>

    <section v-else>
      <div class="exhibitions-grid">
        <article
          v-for="exhibition in exhibitions"
          :key="exhibition.documentId || exhibition.id"
          class="exhibition-card"
        >
          <NuxtLink
            :to="`/mostre/${getExhibitionSlug(exhibition)}`"
            class="exhibition-link"
          >
            <div class="exhibition-image">
              <img
                v-if="getExhibitionImage(exhibition)"
                :src="getExhibitionImage(exhibition) || ''"
                :alt="getExhibitionTitle(exhibition)"
                loading="lazy"
              >

              <span v-else>
                Mostra
              </span>
            </div>

            <div class="exhibition-content">
              <p v-if="getDateLabel(exhibition)" class="date">
                {{ getDateLabel(exhibition) }}
              </p>

              <h2>{{ getExhibitionTitle(exhibition) }}</h2>

              <p class="meta">
                <span v-if="getRelationCount(exhibition.artists)">
                  {{ getRelationCount(exhibition.artists) }} artisti
                </span>

                <span v-if="getRelationCount(exhibition.artworks)">
                  {{ getRelationCount(exhibition.artworks) }} opere
                </span>

                <span v-if="getRelationCount(exhibition.projects)">
                  {{ getRelationCount(exhibition.projects) }} progetti
                </span>
              </p>
            </div>
          </NuxtLink>
        </article>
      </div>

      <nav
        v-if="pagination.total > pageSize"
        class="pagination"
        aria-label="Paginazione mostre"
      >
        <button
          type="button"
          class="pagination-button"
          :disabled="currentPage <= 1"
          @click="goToPage(currentPage - 1)"
        >
          Precedente
        </button>

        <button
          v-for="page in pageCount"
          :key="page"
          type="button"
          class="pagination-number"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>

        <button
          type="button"
          class="pagination-button"
          :disabled="currentPage >= pageCount"
          @click="goToPage(currentPage + 1)"
        >
          Successiva
        </button>
      </nav>
    </section>
  </main>
</template>

<style scoped>
.page {
  max-width: 1440px;
  margin: 0 auto;
  padding: 72px 40px 96px;
}

.page-heading {
  margin-bottom: 48px;
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
  font-size: clamp(48px, 8vw, 96px);
  line-height: 0.95;
  letter-spacing: -0.07em;
}

.summary {
  margin: 24px 0 0;
  color: #666;
  font-size: 16px;
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

.exhibitions-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.exhibition-card {
  overflow: hidden;
  border: 1px solid #e8e8e8;
  border-radius: 18px;
  background: #fff;
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.exhibition-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
}

.exhibition-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.exhibition-image {
  position: relative;
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

.exhibition-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.exhibition-content {
  padding: 20px;
}

.exhibition-content .date {
  margin: 0 0 10px;
  color: #777;
  font-size: 13px;
}

.exhibition-content h2 {
  margin: 0;
  font-size: 24px;
  line-height: 1.1;
  letter-spacing: -0.04em;
}

.exhibition-content .meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0 0;
  color: #777;
  font-size: 14px;
}

.exhibition-content .meta span:not(:last-child)::after {
  content: "·";
  margin-left: 8px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 56px;
}

.pagination-button,
.pagination-number {
  min-width: 42px;
  height: 42px;
  padding: 0 14px;
  border: 1px solid #ddd;
  border-radius: 999px;
  color: #111;
  background: #fff;
  cursor: pointer;
  font: inherit;
}

.pagination-button:disabled {
  color: #aaa;
  cursor: not-allowed;
  background: #f4f4f4;
}

.pagination-number.active {
  color: #fff;
  border-color: #111;
  background: #111;
}

@media (max-width: 900px) {
  .exhibitions-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .page {
    padding: 48px 20px 72px;
  }

  .exhibitions-grid {
    grid-template-columns: 1fr;
  }
}
</style>