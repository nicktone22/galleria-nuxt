export function useStrapiMedia() {
  const config = useRuntimeConfig()

  function resolveUrl(item: any): string | null {
    if (!item) return null

    return (
      item.url ||
      item.formats?.large?.url ||
      item.formats?.medium?.url ||
      item.formats?.small?.url ||
      item.formats?.thumbnail?.url ||
      item.attributes?.url ||
      item.attributes?.formats?.large?.url ||
      item.attributes?.formats?.medium?.url ||
      item.attributes?.formats?.small?.url ||
      item.attributes?.formats?.thumbnail?.url ||
      null
    )
  }

  function getMediaUrl(media: any): string | null {
    if (!media) return null

    const firstItem = Array.isArray(media)
      ? media[0]
      : Array.isArray(media?.data)
        ? media.data[0]
        : media?.data || media

    const url =
      resolveUrl(firstItem) ||
      resolveUrl(firstItem?.file) ||
      resolveUrl(firstItem?.image) ||
      resolveUrl(firstItem?.media) ||
      resolveUrl(firstItem?.upload) ||
      resolveUrl(firstItem?.asset)

    if (!url) return null

    if (url.startsWith('http')) {
      return url
    }

    return `${config.public.strapiUrl}${url}`
  }

  return {
    getMediaUrl
  }
}