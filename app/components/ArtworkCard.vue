<script setup lang="ts">
const props = defineProps<{
  artwork: any
}>()

const localePath = useLocalePath()

const { getMediaUrl } = useStrapiMedia()
const { tArtworkValue } = useArtworkI18n()

const { currentLocale } = useCurrentLocale()

function getArtworkTitle(artwork: any) {
  return artwork?.title ||
    artwork?.name ||
    artwork?.attributes?.title ||
    artwork?.attributes?.name ||
    'Senza titolo'
}

function getArtworkSlug(artwork: any) {
  return artwork?.slug ||
    artwork?.attributes?.slug ||
    artwork?.documentId ||
    artwork?.id
}

function getArtworkImage(artwork: any) {
  const media = artwork?.media || artwork?.attributes?.media

  return getMediaUrl(
    media?.file ||
    media?.image ||
    media?.media ||
    media?.upload ||
    media?.asset ||
    media
  )
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
    'Senza nome'
}

function getRelationSlug(item: any) {
  return item?.slug ||
    item?.attributes?.slug ||
    item?.documentId ||
    item?.id
}

const artists = computed(() => {
  return getRelationItems(props.artwork?.artists)
})

const primaryArtist = computed(() => {
  return artists.value[0] || null
})

const details = computed(() => {
  return props.artwork?.details || props.artwork?.attributes?.details || []
})

function getDetailComponents(componentName: string) {
  const source = details.value

  if (!source) return []

  const items = Array.isArray(source) ? source : [source]

  return items.filter((item: any) => {
    return item?.__component === componentName
  })
}

function getFieldFromComponents(componentName: string, keys: string[]) {
  const components = getDetailComponents(componentName)

  for (const component of components) {
    for (const key of keys) {
      const value = component?.[key]

      if (value !== null && value !== undefined && value !== '') {
        return value
      }
    }
  }

  return ''
}

const year = computed(() => {
  return getFieldFromComponents('artwork.identification', [
    'year',
    'anno',
    'date',
    'data'
  ]) ||
    props.artwork?.year ||
    props.artwork?.date ||
    props.artwork?.attributes?.year ||
    props.artwork?.attributes?.date ||
    ''
})

const artworkType = computed(() => {
  const value =
    getFieldFromComponents('artwork.identification', [
      'artwork_type',
      'object_type',
      'type',
      'category'
    ]) ||
    getFieldFromComponents('artwork.classification', [
      'artwork_type',
      'object_type',
      'type',
      'category'
    ]) ||
    props.artwork?.artwork_type ||
    props.artwork?.type ||
    props.artwork?.category ||
    props.artwork?.attributes?.artwork_type ||
    props.artwork?.attributes?.type ||
    props.artwork?.attributes?.category ||
    ''

  return value ? tArtworkValue(value, currentLocale.value) : ''
})
</script>

<template>
  <article class="artwork-card">
    <NuxtLink
      :to="localePath(`/opere/${getArtworkSlug(artwork)}`)"
      class="artwork-link"
    >
      <div class="artwork-image">
        <img
          v-if="getArtworkImage(artwork)"
          :src="getArtworkImage(artwork) || ''"
          :alt="getArtworkTitle(artwork)"
          loading="lazy"
        >

        <span v-else>
          Opera
        </span>
      </div>

      <div class="artwork-content">
        <h3>{{ getArtworkTitle(artwork) }}</h3>

        <div class="artwork-meta">
          <NuxtLink
            v-if="primaryArtist"
            :to="localePath(`/artisti/${getRelationSlug(primaryArtist)}`)"
            class="artist-link"
            @click.stop
          >
            {{ getRelationTitle(primaryArtist) }}
          </NuxtLink>

          <span v-if="year">
            {{ year }}
          </span>

          <span v-if="artworkType">
            {{ artworkType }}
          </span>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<style scoped>
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
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  color: #aaa;
  background: #f4f4f4;
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
  padding: 16px;
}

.artwork-content h3 {
  margin: 0;
  font-size: 18px;
  line-height: 1.2;
  letter-spacing: -0.03em;
}

.artwork-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 10px;
  margin-top: 10px;
  color: #777;
  font-size: 13px;
  line-height: 1.35;
}

.artwork-meta span,
.artwork-meta a {
  color: #777;
}

.artwork-meta span:not(:last-child)::after,
.artwork-meta a:not(:last-child)::after {
  content: "·";
  margin-left: 10px;
  color: #aaa;
}

.artist-link {
  position: relative;
  z-index: 2;
  text-decoration: none;
}

.artist-link:hover {
  color: #111;
  text-decoration: underline;
  text-underline-offset: 4px;
}
</style>