export function useCurrentLocale() {
  const { locale } = useI18n()

  const currentLocale = computed(() => {
    return locale.value || 'it'
  })

  return {
    currentLocale
  }
}