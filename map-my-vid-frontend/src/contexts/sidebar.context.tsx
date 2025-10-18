import { createContext, useContext, useState } from 'react'

interface SidebarContextType {
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)

  return <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>{children}</SidebarContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
