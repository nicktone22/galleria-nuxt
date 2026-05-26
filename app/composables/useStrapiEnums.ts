export function useStrapiEnums() {
  const config = useRuntimeConfig()
  const { get } = useStrapiApi()

  async function getEnumLabels(locale = 'it') {
    const endpoint = config.strapiEnumsEndpoint || 'utils/enums/lang'

    const response = await get<any>(`${endpoint}/${locale}`)

    return response?.enums || {}
  }

  return {
    getEnumLabels
  }
}