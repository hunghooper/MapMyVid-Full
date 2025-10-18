import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import es from './locales/es.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'
import vi from './locales/vi.json'
import zh from './locales/zh.json'

const resources = {
  vi: { translation: vi },
  en: { translation: en },
  ja: { translation: ja },
  ko: { translation: ko },
  es: { translation: es },
  zh: { translation: zh }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'vi', // Default language
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false // React already escapes values
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  })

export default i18n
