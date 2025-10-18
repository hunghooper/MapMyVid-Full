import { useState } from 'react'
import { ChevronDown, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'vi', name: 'vietnamese', flag: '🇻🇳' },
    { code: 'en', name: 'english', flag: '🇺🇸' },
    { code: 'ja', name: 'japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'korean', flag: '🇰🇷' },
    { code: 'es', name: 'spanish', flag: '🇪🇸' },
    { code: 'zh', name: 'chinese', flag: '🇨🇳' }
  ] as const
  type Language = (typeof languages)[number]
  type LanguageCode = Language['code']

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0]

  const handleLanguageChange = (languageCode: LanguageCode) => {
    if (languageCode !== i18n.language) {
      i18n.changeLanguage(languageCode)
    }
    setIsOpen(false)
  }

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center space-x-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm transition-colors hover:bg-gray-50'
        aria-label={t('header.toggleMenu')}
      >
        <Globe className='h-4 w-4' />
        <span className='hidden sm:block'>{currentLanguage.flag}</span>
        <span className='hidden md:block'>{t(`language.${currentLanguage.name}`)}</span>
        <ChevronDown className='h-4 w-4' />
      </button>

      {isOpen && (
        <>
          <div className='fixed inset-0 z-10' onClick={() => setIsOpen(false)} />
          <div className='absolute right-0 z-20 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5'>
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`flex w-full items-center space-x-3 px-4 py-2 text-left text-sm transition-colors hover:bg-gray-100 ${
                  i18n.language === language.code ? 'bg-gray-50 font-medium' : ''
                }`}
              >
                <span className='text-lg'>{language.flag}</span>
                <span>{t(`language.${language.name}`)}</span>
                {i18n.language === language.code && <span className='ml-auto text-xs text-gray-500'>✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default LanguageSwitcher
