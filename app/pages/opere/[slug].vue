<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

const { find } = useStrapiApi()
const { getMediaUrl } = useStrapiMedia()
const { getComponentLabels } = useStrapiComponentLabels()
const { getEnumLabels } = useStrapiEnums()
const { tArtworkField, tArtworkSection, tArtworkValue } = useArtworkI18n()

const slug = computed(() => String(route.params.slug || ''))

const currentLocale = computed(() => {
  return config.public.defaultLocale || 'it'
})

const isDetailsOpen = ref(false)

function openDetailsPanel() {
  isDetailsOpen.value = true
}

function closeDetailsPanel() {
  isDetailsOpen.value = false
}

/**
 * Opera
 */
const { data, pending, error } = await useAsyncData(
  () => `artwork-detail-${slug.value}-${currentLocale.value}`,
  () =>
    find<any>('artworks', {
      locale: currentLocale.value,

      'filters[slug][$eq]': slug.value,

      'populate[media][populate]': '*',
      'populate[artists][populate]': '*',
      'populate[exhibitions][populate]': '*',
      'populate[projects][populate]': '*',
      'populate[details][populate]': '*',
      'populate[dimensions][populate]': '*',
      'populate[pricing][populate]': '*',
      'populate[management][populate]': '*',
      'populate[tags][populate]': '*'
    })
)

const artwork = computed(() => {
  return data.value?.data?.[0] || null
})

/**
 * Labels campi da Strapi Content Type Builder
 */
const { data: componentLabelsData } = await useAsyncData(
  () => `component-labels-${currentLocale.value}`,
  () => getComponentLabels(currentLocale.value)
)

const componentLabels = computed<Record<string, string>>(() => {
  return componentLabelsData.value || {}
})

/**
 * Labels valori enum da Strapi
 * Endpoint: /api/utils/enums/lang/it
 */
const { data: enumLabelsData } = await useAsyncData(
  () => `enum-labels-${currentLocale.value}`,
  () => getEnumLabels(currentLocale.value)
)

const enumLabels = computed<Record<string, Record<string, string>>>(() => {
  return enumLabelsData.value || {}
})

/**
 * Helpers base
 */
function getArtworkTitle(item: any) {
  return item?.title ||
    item?.name ||
    item?.attributes?.title ||
    item?.attributes?.name ||
    'Senza titolo'
}

function getArtworkImage(item: any) {
  if (!item) return null

  const media = item.media || item.attributes?.media

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

/**
 * Campi principali opera
 */
const description = computed(() => {
  return getText(
    artwork.value?.description ||
    artwork.value?.descrizione ||
    artwork.value?.content ||
    artwork.value?.body
  )
})

const details = computed(() => artwork.value?.details || {})
const dimensions = computed(() => artwork.value?.dimensions || {})
const management = computed(() => artwork.value?.management || {})
const pricing = computed(() => artwork.value?.pricing || {})

const artists = computed(() => getRelationItems(artwork.value?.artists))
const exhibitions = computed(() => getRelationItems(artwork.value?.exhibitions))
const projects = computed(() => getRelationItems(artwork.value?.projects))
const tags = computed(() => getRelationItems(artwork.value?.tags))

/**
 * Fallback labels locali
 * Questi restano utili se Strapi non restituisce una label.
 */
const fieldLabels: Record<string, string> = {
  certificate_of_authenticity: 'Certificato di autenticità',
  restored: 'Restaurato',
  framed: 'Incorniciato',
  mounted: 'Montato',

  width: 'Larghezza',
  larghezza: 'Larghezza',
  height: 'Altezza',
  altezza: 'Altezza',
  depth: 'Profondità',
  profondita: 'Profondità',
  profondità: 'Profondità',
  dimension_unit: 'Unità dimensioni',
  unit: 'Unità dimensioni',
  unita: 'Unità dimensioni',
  unità: 'Unità dimensioni',

  year: 'Anno',
  anno: 'Anno',
  date: 'Data',
  data: 'Data',
  technique: 'Tecnica',
  tecnica: 'Tecnica',
  medium: 'Tecnica',
  materials: 'Materiali',
  materiali: 'Materiali',
  category: 'Categoria',
  categoria: 'Categoria',
  type: 'Tipologia',
  tipologia: 'Tipologia',

  provenance: 'Provenienza',
  provenienza: 'Provenienza',
  rights: 'Diritti',
  diritti: 'Diritti',

  commercial_status: 'Stato commerciale',
  physical_status: 'Stato fisico',
  location_label: 'Posizione',
  location_type: 'Tipo posizione',
  ownership_type: 'Tipo proprietà',

  price: 'Prezzo',
  prezzo: 'Prezzo',
  status: 'Stato',
  stato: 'Stato',
  currency: 'Valuta',
  vat_included: 'IVA inclusa',
  hide_price: 'Nascondi prezzo'
}

/**
 * Mappa tra chiave campo e chiave enum restituita da:
 * /api/utils/enums/lang/it
 */
const enumFieldMap: Record<string, string> = {
  dimension_unit: 'artwork_dimensions_dimension_unit',
  weight_unit: 'artwork_dimensions_weight_unit',

  commercial_status: 'artwork_managements_commercial_status',
  physical_status: 'artwork_managements_physical_status',
  location_type: 'artwork_managements_location_type',
  ownership_type: 'artwork_managements_ownership_type',

  currency: 'artwork_pricing_currency',

  artwork_type: 'artwork_type',
  type: 'artwork_type'
}

const ignoredDetailKeys = [
  'id',
  'documentId',
  '__component',
  'createdAt',
  'updatedAt',
  'publishedAt',
  'locale'
]

function cleanFieldKey(key: string) {
  return key
    .replace(/^tss_/i, '')
    .replace(/^artwork_/i, '')
    .replace(/^various_/i, '')
}

function humanizeKey(key: string) {
  return key
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatDetailLabel(key: string, componentUid = '') {
  const cleanKey = cleanFieldKey(key)

  return (
    tArtworkField(key, currentLocale.value) ||
    tArtworkField(cleanKey, currentLocale.value) ||
    (componentUid ? componentLabels.value[`${componentUid}.${key}`] : '') ||
    componentLabels.value[key] ||
    componentLabels.value[cleanKey] ||
    fieldLabels[key] ||
    fieldLabels[cleanKey] ||
    humanizeKey(cleanKey)
  )
}

function translateEnumValue(key: string, value: any, componentUid = ''): string {
  if (value === null || value === undefined || value === '') return ''

  if (typeof value === 'boolean') {
    return tArtworkValue(value, currentLocale.value)
  }

  const stringValue = String(value)

  const localTranslatedValue = tArtworkValue(stringValue, currentLocale.value)
  if (localTranslatedValue && localTranslatedValue !== stringValue) {
    return localTranslatedValue
  }
  const cleanKey = cleanFieldKey(key)

  const componentEnumKey = componentUid
    ? `${componentUid.replace(/\./g, '_')}_${cleanKey}`
    : ''

  const mappedEnumKey = enumFieldMap[cleanKey]

  const possibleEnumKeys = [
    componentEnumKey,
    mappedEnumKey,
    cleanKey,
    key,
    `artwork_${cleanKey}`,
    `artwork_${cleanKey}s`,
    `artwork_details_${cleanKey}`,
    `artwork_dimensions_${cleanKey}`,
    `artwork_managements_${cleanKey}`,
    `artwork_pricing_${cleanKey}`,
    `artwork_pricing_${cleanKey}s`
  ].filter(Boolean) as string[]

  for (const enumKey of possibleEnumKeys) {
    const translated = enumLabels.value?.[enumKey]?.[stringValue]

    if (translated) {
      return translated
    }
  }

  return stringValue
}

function normalizeValue(value: any) {
  if (value === null || value === undefined || value === '') return ''

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeValue(item))
      .filter(Boolean)
      .join(', ')
  }

  if (typeof value === 'object') {
    if (value.title) return String(value.title)
    if (value.name) return String(value.name)
    if (value.value) return String(value.value)
    if (value.text) return String(value.text)
  }

  return ''
}

function normalizeDetailValue(value: any, key = '', componentUid = ''): string {
  if (value === null || value === undefined || value === '') return ''

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return translateEnumValue(key, value, componentUid)
  }

  if (Array.isArray(value)) {
    const richText = getText(value)
    if (richText) return richText

    return value
      .map((item) => normalizeDetailValue(item, key, componentUid))
      .filter(Boolean)
      .join(', ')
  }

  if (typeof value === 'object') {
    if (value.title) return String(value.title)
    if (value.name) return String(value.name)
    if (value.value) return translateEnumValue(key, value.value, componentUid)
    if (value.text) return String(value.text)

    return ''
  }

  return ''
}

function getField(source: any, keys: string[]) {
  if (!source) return ''

  for (const key of keys) {
    const value = normalizeValue(source[key])
    if (value) return value
  }

  return ''
}

function buildDetailRows(source: any) {
  if (!source) return []

  if (Array.isArray(source)) {
    return source.flatMap((item) => buildDetailRows(item))
  }

  if (typeof source !== 'object') return []

  const componentUid = source.__component || ''

  return Object.entries(source)
    .filter(([key]) => !ignoredDetailKeys.includes(key))
    .map(([key, value]) => {
      return {
        key,
        label: formatDetailLabel(key, componentUid),
        value: normalizeDetailValue(value, key, componentUid)
      }
    })
    .filter((row) => row.value)
}

/**
 * Dati sintetici visibili nella pagina
 */
const year = computed(() => {
  return getField(details.value, ['year', 'anno', 'date', 'data'])
})

const technique = computed(() => {
  return getField(details.value, ['technique', 'tecnica', 'medium', 'materials', 'materiali'])
})

const category = computed(() => {
  return getField(details.value, ['category', 'categoria', 'type', 'tipologia'])
})

const width = computed(() => {
  return getField(dimensions.value, ['width', 'larghezza'])
})

const height = computed(() => {
  return getField(dimensions.value, ['height', 'altezza'])
})

const depth = computed(() => {
  return getField(dimensions.value, ['depth', 'profondita', 'profondità'])
})

const unit = computed(() => {
  return translateEnumValue(
    'dimension_unit',
    getField(dimensions.value, ['dimension_unit', 'unit', 'unita', 'unità']) || 'CM'
  )
})

const dimensionsLabel = computed(() => {
  const parts = []

  if (height.value) parts.push(`H ${height.value}`)
  if (width.value) parts.push(`W ${width.value}`)
  if (depth.value) parts.push(`D ${depth.value}`)

  if (!parts.length) return ''

  return `${parts.join(' × ')} ${unit.value}`
})

/**
 * Sezioni off-canvas
 */
const detailSections = computed(() => {
  return [
    {
      title: tArtworkSection('artwork_details', currentLocale.value),
      rows: buildDetailRows(details.value)
    },
    {
      title: tArtworkSection('dimensions', currentLocale.value),
      rows: buildDetailRows(dimensions.value)
    },
    {
      title: tArtworkSection('management', currentLocale.value),
      rows: buildDetailRows(management.value)
    },
    {
      title: tArtworkSection('pricing', currentLocale.value),
      rows: buildDetailRows(pricing.value)
    }
  ].filter((section) => section.rows.length)
})

const hasDetailSections = computed(() => {
  return detailSections.value.length > 0
})

useSeoMeta({
  title: () =>
    artwork.value
      ? `${getArtworkTitle(artwork.value)} | Thetis Gallery`
      : 'Opera | Thetis Gallery',

  description: () =>
    description.value
      ? description.value.slice(0, 160)
      : 'Opera della galleria Thetis.'
})
</script>


<template>
  <main class="page">
    <section v-if="pending" class="state">
      Caricamento opera...
    </section>

    <section v-else-if="error" class="state error">
      <h1>Errore nel caricamento</h1>
      <pre>{{ error?.message || error }}</pre>
    </section>

    <section v-else-if="!artwork" class="state">
      <h1>Opera non trovata</h1>

      <NuxtLink to="/opere" class="back-link">
        Torna alle opere
      </NuxtLink>
    </section>

    <section v-else class="artwork-detail">
      <div class="artwork-media">
        <img
          v-if="getArtworkImage(artwork)"
          :src="getArtworkImage(artwork) || ''"
          :alt="getArtworkTitle(artwork)"
        >

        <span v-else>
          Opera
        </span>
      </div>

      <div class="artwork-info">
        <NuxtLink to="/opere" class="back-link">
          ← Tutte le opere
        </NuxtLink>

        <p class="eyebrow">Opera</p>

        <h1>{{ getArtworkTitle(artwork) }}</h1>

        <div v-if="artists.length" class="artists">
          <NuxtLink
            v-for="artist in artists"
            :key="artist.documentId || artist.id"
            :to="`/artisti/${getRelationSlug(artist)}`"
          >
            {{ getRelationTitle(artist) }}
          </NuxtLink>
        </div>

        <button
          v-if="hasDetailSections"
          type="button"
          class="details-button"
          @click="openDetailsPanel"
        >
          Dettagli →
        </button>

        <div
          v-if="year || technique || category || dimensionsLabel"
          class="facts"
        >
          <div v-if="year" class="fact">
            <span>Anno</span>
            <strong>{{ year }}</strong>
          </div>

          <div v-if="technique" class="fact">
            <span>Tecnica</span>
            <strong>{{ technique }}</strong>
          </div>

          <div v-if="category" class="fact">
            <span>Tipologia</span>
            <strong>{{ category }}</strong>
          </div>

          <div v-if="dimensionsLabel" class="fact">
            <span>Dimensioni</span>
            <strong>{{ dimensionsLabel }}</strong>
          </div>
        </div>

        <div v-if="description" class="content-block">
          <h2>Descrizione</h2>
          <p>{{ description }}</p>
        </div>

        <div v-if="tags.length" class="content-block">
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

        <div v-if="exhibitions.length" class="content-block">
          <h2>Mostre collegate</h2>

          <ul class="relations">
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

        <div v-if="projects.length" class="content-block">
          <h2>Progetti collegati</h2>

          <ul class="relations">
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

        <details class="debug">
          <summary>Dati tecnici Strapi</summary>
          <pre>{{ artwork }}</pre>
        </details>
      </div>
    </section>
    <Teleport to="body">
      <div
        v-if="isDetailsOpen"
        class="offcanvas-overlay"
        @click="closeDetailsPanel"
      />

      <aside
        class="details-offcanvas"
        :class="{ open: isDetailsOpen }"
        aria-label="Dettagli opera"
      >
        <div class="offcanvas-header">
          <div>
            <p class="eyebrow">Dettagli opera</p>
            <h2>{{ getArtworkTitle(artwork) }}</h2>
          </div>

          <button
            type="button"
            class="offcanvas-close"
            aria-label="Chiudi dettagli"
            @click="closeDetailsPanel"
          >
            ×
          </button>
        </div>

        <div class="offcanvas-body">
          <div
            v-for="section in detailSections"
            :key="section.title"
            class="details-table-block"
          >
            <h3>{{ section.title }}</h3>

            <table>
              <tbody>
                <tr
                  v-for="row in section.rows"
                  :key="row.key"
                >
                  <th>{{ row.label }}</th>
                  <td>{{ row.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </aside>
    </Teleport>
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

.artwork-detail {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(340px, 0.85fr);
  gap: 56px;
  align-items: start;
}

.artwork-media {
  position: sticky;
  top: 104px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 560px;
  overflow: hidden;
  border-radius: 24px;
  background: #f7f7f7;
  color: #aaa;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.artwork-media img {
  width: 100%;
  height: 100%;
  max-height: 760px;
  object-fit: contain;
}

.artwork-info {
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
  font-size: clamp(44px, 6vw, 84px);
  line-height: 0.95;
  letter-spacing: -0.07em;
}

.artists {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
}

.artists a {
  display: inline-flex;
  padding: 8px 14px;
  border: 1px solid #ddd;
  border-radius: 999px;
  color: #111;
  font-size: 14px;
  text-decoration: none;
}

.artists a:hover {
  border-color: #111;
}

.facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 40px;
}

.fact {
  padding: 18px;
  border: 1px solid #eee;
  border-radius: 16px;
  background: #fafafa;
}

.fact span {
  display: block;
  margin-bottom: 8px;
  color: #777;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.fact strong {
  display: block;
  color: #111;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.35;
}

.content-block {
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid #eee;
}

.content-block h2 {
  margin: 0 0 16px;
  font-size: 15px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.content-block p {
  margin: 0;
  color: #444;
  font-size: 18px;
  line-height: 1.6;
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

.relations {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.relations a {
  color: #111;
  font-size: 17px;
  text-decoration: none;
}

.relations a:hover {
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

pre {
  max-height: 360px;
  overflow: auto;
  margin: 16px 0 0;
  padding: 16px;
  border-radius: 12px;
  background: #f5f5f5;
  white-space: pre-wrap;
  font-size: 13px;
}

.details-button {
  display: inline-flex;
  align-items: center;
  margin-top: 28px;
  padding: 10px 18px;
  border: 1px solid #111;
  border-radius: 999px;
  color: #111;
  background: transparent;
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
}

.details-button:hover {
  color: #fff;
  background: #111;
}

.offcanvas-overlay {
  position: fixed;
  inset: 0;
  z-index: 80;
  background: rgba(0, 0, 0, 0.35);
}

.details-offcanvas {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 90;
  width: 50vw;
  max-width: 760px;
  min-width: 420px;
  height: 100vh;
  background: #fff;
  box-shadow: -24px 0 60px rgba(0, 0, 0, 0.18);
  transform: translateX(100%);
  transition: transform 240ms ease;
  overflow: hidden;
}

.details-offcanvas.open {
  transform: translateX(0);
}

.offcanvas-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 32px 36px;
  border-bottom: 1px solid #eee;
}

.offcanvas-header .eyebrow {
  margin-bottom: 8px;
}

.offcanvas-header h2 {
  margin: 0;
  font-size: 28px;
  line-height: 1.05;
  letter-spacing: -0.04em;
  text-transform: none;
}

.offcanvas-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 999px;
  background: #fff;
  color: #111;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
}

.offcanvas-close:hover {
  border-color: #111;
}

.offcanvas-body {
  height: calc(100vh - 118px);
  overflow-y: auto;
  padding: 32px 36px 48px;
}

.details-table-block {
  margin-top: 32px;
}

.details-table-block:first-child {
  margin-top: 0;
}

.details-table-block h3,
.details-table-block h2 {
  margin: 0 0 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ccc;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: normal;
  text-transform: none;
}

.details-table-block table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.details-table-block th,
.details-table-block td {
  padding: 10px 12px;
  border: 1px solid #d8d8d8;
  vertical-align: top;
  text-align: left;
}

.details-table-block th {
  width: 40%;
  background: #f5f5f5;
  font-weight: 600;
}

.details-table-block td {
  background: #fff;
}

@media (max-width: 900px) {
  .details-offcanvas {
    width: 88vw;
    min-width: 0;
  }
}

@media (max-width: 640px) {
  .details-offcanvas {
    width: 100vw;
    max-width: none;
  }

  .offcanvas-header,
  .offcanvas-body {
    padding-left: 20px;
    padding-right: 20px;
  }
}

.details-section {
  margin-top: 48px;
  padding-top: 40px;
  border-top: 1px solid #ddd;
  scroll-margin-top: 120px;
}

.details-table-block {
  margin-top: 32px;
}

.details-table-block:first-child {
  margin-top: 0;
}

.details-table-block h2 {
  margin: 0 0 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ccc;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: normal;
  text-transform: none;
}

.details-table-block table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.details-table-block th,
.details-table-block td {
  padding: 10px 12px;
  border: 1px solid #d8d8d8;
  vertical-align: top;
  text-align: left;
}

.details-table-block th {
  width: 40%;
  background: #f5f5f5;
  font-weight: 600;
}

.details-table-block td {
  background: #fff;
}

@media (max-width: 960px) {
  .artwork-detail {
    grid-template-columns: 1fr;
  }

  .artwork-media {
    position: relative;
    top: auto;
    min-height: auto;
    aspect-ratio: 4 / 3;
  }
}

@media (max-width: 640px) {
  .page {
    padding: 48px 20px 72px;
  }

  .facts {
    grid-template-columns: 1fr;
  }
}
</style>