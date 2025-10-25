import { useContext, useState } from 'react'
import authApi from '@/api/auth.api'
import path from '@/constants/path'
import { AppContext } from '@/contexts/app.context'
import { useMutation } from '@tanstack/react-query'
import Logo from 'assets/LOGO-Photoroom.png'
import LanguageSwitcher from 'components/LanguageSwitcher'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { clearAllAuthData } from '@/utils/auth'

const Header = () => {
  const { setIsAuthenticated, setProfile, isAuthenticated } = useContext(AppContext)
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useTranslation()

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const logoutAccountMutation = useMutation({
    mutationFn: authApi.logoutAccount,
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
      clearAllAuthData()
      console.log('Logout successful - redirecting to login')
      // Routing system will automatically redirect due to isAuthenticated = false
    },
    onError: (error) => {
      console.error('Logout failed:', error)
      // Even if API fails, clear local data and redirect
      setIsAuthenticated(false)
      setProfile(null)
      clearAllAuthData()
    }
  })

  const handleLogout = () => {
    console.log('Logging out...', isAuthenticated)
    logoutAccountMutation.mutate()
  }

  return (
    <header className='border-b border-gray-100 bg-white'>
      <div className='mx-auto max-w-7xl px-6 py-4'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <div className='flex items-center space-x-3'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-200'>
              <img src={Logo} alt='Logo' />
            </div>
            <span className='text-lg font-medium text-gray-900'>{t('app.name')}</span>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden items-center space-x-6 md:flex'>
            <nav>
              <ul className='flex items-center space-x-8'>
                <li>
                  <a href='#' className='text-sm text-gray-600 transition-colors hover:text-gray-900'>
                    {t('header.home')}
                  </a>
                </li>
                <li>
                  <a href='#' className='text-sm text-gray-600 transition-colors hover:text-gray-900'>
                    {t('header.library')}
                  </a>
                </li>
                <li>
                  <a href='#' className='text-sm text-gray-600 transition-colors hover:text-gray-900'>
                    {t('header.profile')}
                  </a>
                </li>
                <li>
                  <Link
                    to={path.logout}
                    onClick={handleLogout}
                    className='rounded-md bg-gray-900 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-800'
                  >
                    {t('header.logout')}
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <button className='md:hidden' onClick={toggleMenu} aria-label={t('header.toggleMenu')}>
            <svg className='h-5 w-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              {menuOpen ? (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              ) : (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className='mt-4 border-t border-gray-100 pt-4 md:hidden'>
            <ul className='space-y-3'>
              <li>
                <a href='#' className='block py-2 text-sm text-gray-600 hover:text-gray-900'>
                  {t('header.home')}
                </a>
              </li>
              <li>
                <a href='#' className='block py-2 text-sm text-gray-600 hover:text-gray-900'>
                  {t('header.library')}
                </a>
              </li>
              <li>
                <a href='#' className='block py-2 text-sm text-gray-600 hover:text-gray-900'>
                  {t('header.profile')}
                </a>
              </li>
              <li className='pt-2'>
                <Link
                  to={path.logout}
                  onClick={handleLogout}
                  className='w-full rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800'
                >
                  {t('header.logout')}
                </Link>
              </li>
              <li className='pt-2'>
                <div className='flex justify-center'>
                  <LanguageSwitcher />
                </div>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
