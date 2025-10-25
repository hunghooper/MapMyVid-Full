import { User } from '../types/user.type'

export const LocalStorageEventTarget = new EventTarget()

export const setAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
  const clearLSEvent = new Event('clearLS')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}

export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''

export const setProfileToLS = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

// Cookie utilities
export const clearCookies = () => {
  // Get all cookies
  const cookies = document.cookie.split(';')
  
  // Clear each cookie by setting it to expire in the past
  cookies.forEach(cookie => {
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
    
    // Clear cookie for current domain
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
    
    // Clear cookie for parent domain (if any)
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`
    
    // Clear cookie for subdomain (if any)
    const domainParts = window.location.hostname.split('.')
    if (domainParts.length > 1) {
      const parentDomain = '.' + domainParts.slice(-2).join('.')
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${parentDomain}`
    }
  })
}

export const clearAllAuthData = () => {
  clearLS()
  clearCookies()
}