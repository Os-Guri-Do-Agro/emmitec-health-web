import { createI18n } from 'vue-i18n'
import pt from './locales/pt.json'
import en from './locales/en.json'
import es from './locales/es.json'

export const SUPPORTED_LOCALES = ['pt', 'en', 'es'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]
export const LOCALE_STORAGE_KEY = 'emmitec.locale'

function getInitialLocale(): SupportedLocale {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (saved && (SUPPORTED_LOCALES as readonly string[]).includes(saved)) {
      return saved as SupportedLocale
    }
  } catch {
    // localStorage indisponível (SSR / privacidade) — segue para fallback
  }
  return 'pt'
}

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'pt',
  messages: {
    pt,
    en,
    es,
  },
})

export default i18n
