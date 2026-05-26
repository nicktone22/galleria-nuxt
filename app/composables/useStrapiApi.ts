export function useStrapiApi() {
  const config = useRuntimeConfig()

  async function find<T>(
    endpoint: string,
    query: Record<string, any> = {}
  ): Promise<T> {
    return await $fetch<T>(`${config.public.strapiUrl}/api/${endpoint}`, {
      query
    })
  }

  async function get<T>(
    endpoint: string,
    query: Record<string, any> = {}
  ): Promise<T> {
    return await $fetch<T>(`${config.public.strapiUrl}/api/${endpoint}`, {
      query
    })
  }

  return {
    find,
    get
  }
}