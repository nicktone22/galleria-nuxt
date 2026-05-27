<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { find } = useStrapiApi()

const pageSize = 80

const { t } = useI18n()
const { currentLocale } = useCurrentLocale()

const currentPage = computed(() => {
  const page = Number(route.query.page || 1)
  return Number.isFinite(page) && page > 0 ? page : 1
})

const { data, pending, error } = await useAsyncData(
  () => `artworks-${currentLocale.value}-page-${currentPage.value}`,
  () =>
    find<any>('artworks', {
      locale: currentLocale.value,

      'populate[media][populate]': '*',
      'populate[artists][populate]': '*',
      'populate[details][populate]': '*',

      'pagination[page]': currentPage.value,
      'pagination[pageSize]': pageSize,

      'sort[0]': 'createdAt:desc'
    }),
  {
    watch: [currentPage, currentLocale]
  }
)

const artworks = computed(() => {
  return (data.value?.data || []).slice(0, pageSize)
})

const pagination = computed(() => {
  return data.value?.meta?.pagination || {
    page: 1,
    pageSize,
    pageCount: 1,
    total: 0
  }
})

const pageCount = computed(() => pagination.value.pageCount || 1)

function goToPage(page: number) {
  if (page < 1 || page > pageCount.value) return

  router.push({
    path: '/opere',
    query: {
      ...route.query,
      page: page > 1 ? String(page) : undefined
    }
  })
}
</script>

<template>
  <main class="page">
    <section class="page-heading">
      <p class="eyebrow">Archivio</p>
      <h1>{{ t('archive.artworks') }}</h1>

      <p class="summary">
        {{ pagination.total }} {{ t('archive.foundArtworks') }}.
      </p>
    </section>

    <section v-if="pending" class="state">
      {{ t('archive.loadingArtworks') }}
    </section>

    <section v-else-if="error" class="state error">
      <h2>Errore nel caricamento</h2>
      <pre>{{ error?.message || error }}</pre>
    </section>

    <section v-else>
      <div class="artworks-grid">
        <ArtworkCard
          v-for="artwork in artworks"
          :key="artwork.documentId || artwork.id"
          :artwork="artwork"
        />
      </div>

      <nav
        v-if="pagination.total > pageSize"
        class="pagination"
        aria-label="Paginazione opere"
      >
        <button
          type="button"
          class="pagination-button"
          :disabled="currentPage <= 1"
          @click="goToPage(currentPage - 1)"
        >
          {{ t('archive.previous') }}
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
           {{ t('archive.next') }}
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

.artworks-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
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

.pagination-dots {
  padding: 0 6px;
  color: #777;
}

@media (max-width: 1200px) {
  .artworks-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .artworks-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .page {
    padding: 48px 20px 72px;
  }

  .artworks-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
}

@media (max-width: 460px) {
  .artworks-grid {
    grid-template-columns: 1fr;
  }
}
</style>