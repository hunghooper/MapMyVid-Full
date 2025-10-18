import { createContext, useState } from 'react'
import { User } from '../types/user.type'
import { getAccessTokenFromLS, getProfileFromLS } from '../utils/auth'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  reset: () => void
}

const initialContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  setProfile: () => null,
  profile: getProfileFromLS(),
  reset: () => null
}

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext<AppContextInterface>(initialContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialContext.isAuthenticated)
  const [profile, setProfile] = useState<User | null>(initialContext.profile)

  const reset = () => {
    setIsAuthenticated(false)
    setProfile(null)
  }
  return (
    <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated, profile, setProfile, reset }}>
      {children}
    </AppContext.Provider>
  )
}
