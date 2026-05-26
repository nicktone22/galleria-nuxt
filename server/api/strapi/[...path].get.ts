import { $fetch } from 'ofetch'

import {
  createError,
  defineEventHandler,
  getQuery
} from 'h3'

export default defineEventHandler(async (event): Promise<unknown> => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const pathParam = event.context.params?.path

  const endpoint = Array.isArray(pathParam)
    ? pathParam.join('/')
    : String(pathParam || '')

  if (!endpoint) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing Strapi endpoint'
    })
  }

  return await $fetch(`${config.public.strapiUrl}/api/${endpoint}`, {
    query,
    headers: config.strapiToken
      ? {
          Authorization: `Bearer ${config.strapiToken}`
        }
      : undefined
  })
})