export function useStrapiComponentLabels() {
  const config = useRuntimeConfig()
  const { get } = useStrapiApi()

  function humanizeKey(key: string) {
    return key
      .replace(/^tss_/i, '')
      .replace(/^artwork_/i, '')
      .replace(/^various_/i, '')
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  function getAttributeLabel(key: string, attribute: any, locale = 'it') {
    return (
      attribute?.label?.[locale] ||
      attribute?.label ||
      attribute?.displayName?.[locale] ||
      attribute?.displayName ||
      attribute?.name?.[locale] ||
      attribute?.name ||
      attribute?.customFieldLabel?.[locale] ||
      attribute?.customFieldLabel ||
      humanizeKey(key)
    )
  }

  async function getComponentLabels(locale = 'it') {
    const endpoint = config.strapiComponentsEndpoint || 'content-type-builder/components'

    const response = await get<any>(endpoint)

    const components =
      response?.data ||
      response?.components ||
      response ||
      []

    const labels: Record<string, string> = {}

    for (const component of components) {
      const uid =
        component?.uid ||
        component?.component ||
        component?.schema?.uid

      const attributes =
        component?.schema?.attributes ||
        component?.attributes ||
        {}

      for (const [key, attribute] of Object.entries(attributes)) {
        const label = getAttributeLabel(key, attribute, locale)

        labels[key] = label

        if (uid) {
          labels[`${uid}.${key}`] = label
        }
      }
    }

    return labels
  }

  return {
    getComponentLabels
  }
}