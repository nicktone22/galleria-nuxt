import { defineEventHandler, setResponseHeader } from 'h3'

/**
 * Siti di test: header X-Robots-Tag su tutte le risposte del server.
 * Attivo solo con NUXT_PUBLIC_NOINDEX=true.
 */
export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)

  if (String(config.public.noindex) === 'true') {
    setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow')
  }
})
