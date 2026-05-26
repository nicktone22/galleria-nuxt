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
  () => `projects-${currentLocale.value}-page-${currentPage.value}`,
  () =>
    find<any>('projects', {
      locale: currentLocale.value,

      
      'pagination[page]': currentPage.value,
      'pagination[pageSize]': pageSize,

      'sort[0]': 'createdAt:desc'
    }),
  {
    watch: [currentPage]
  }
)

const projects = computed(() => {
  return (data.value?.data || []).slice(0, pageSize)
})

const pagination = computed(() => {
  return data.value?.meta?.pagination || {
    page: currentPage.value,
    pageSize,
    pageCount: 1,
    total: projects.value.length
  }
})

const pageCount = computed(() => {
  return pagination.value.pageCount || 1
})

function getProjectTitle(project: any) {
  return project.title ||
    project.name ||
    project.attributes?.title ||
    project.attributes?.name ||
    'Senza titolo'
}

function getProjectSlug(project: any) {
  return project.slug ||
    project.attributes?.slug ||
    project.documentId ||
    project.id
}

function getProjectImage(project: any) {
  const media =
    project.media ||
    project.image ||
    project.cover ||
    project.featured_image ||
    project.attributes?.media ||
    project.attributes?.image ||
    project.attributes?.cover ||
    project.attributes?.featured_image

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

function goToPage(page: number) {
  if (page < 1 || page > pageCount.value) return

  router.push({
    path: '/progetti',
    query: {
      ...route.query,
      page: page > 1 ? String(page) : undefined
    }
  })
}

useSeoMeta({
  title: 'Progetti | Thetis Gallery',
  description: 'Archivio progetti della galleria.'
})
</script>

<template>
  <main class="page">
    <section class="page-heading">
      <p class="eyebrow">Archivio</p>
      <h1>Progetti</h1>

      <p class="summary">
        {{ pagination.total }} progetti trovati.
      </p>
    </section>

    <section v-if="pending" class="state">
      Caricamento progetti...
    </section>

    <section v-else-if="error" class="state error">
      <h2>Errore nel caricamento</h2>
      <pre>{{ error?.message || error }}</pre>
    </section>

    <section v-else>
      <div class="projects-grid">
        <article
          v-for="project in projects"
          :key="project.documentId || project.id"
          class="project-card"
        >
          <NuxtLink
            :to="`/progetti/${getProjectSlug(project)}`"
            class="project-link"
          >
            <div class="project-image">
              <img
                v-if="getProjectImage(project)"
                :src="getProjectImage(project) || ''"
                :alt="getProjectTitle(project)"
                loading="lazy"
              >

              <span v-else>
                Progetto
              </span>
            </div>

            <div class="project-content">
              <h2>{{ getProjectTitle(project) }}</h2>

              <p class="meta">
                <span v-if="getRelationCount(project.artists)">
                  {{ getRelationCount(project.artists) }} artisti
                </span>

                <span v-if="getRelationCount(project.artworks)">
                  {{ getRelationCount(project.artworks) }} opere
                </span>

                <span v-if="getRelationCount(project.exhibitions)">
                  {{ getRelationCount(project.exhibitions) }} mostre
                </span>
              </p>
            </div>
          </NuxtLink>
        </article>
      </div>

      <nav
        v-if="pagination.total > pageSize"
        class="pagination"
        aria-label="Paginazione progetti"
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

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.project-card {
  overflow: hidden;
  border: 1px solid #e8e8e8;
  border-radius: 18px;
  background: #fff;
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.project-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
}

.project-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.project-image {
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

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-content {
  padding: 20px;
}

.project-content h2 {
  margin: 0;
  font-size: 24px;
  line-height: 1.1;
  letter-spacing: -0.04em;
}

.project-content .meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0 0;
  color: #777;
  font-size: 14px;
}

.project-content .meta span:not(:last-child)::after {
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
  .projects-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .page {
    padding: 48px 20px 72px;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>