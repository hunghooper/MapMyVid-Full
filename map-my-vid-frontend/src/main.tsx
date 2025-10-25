import { StrictMode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AppProvider } from './contexts/app.context'
import { SidebarProvider } from './contexts/sidebar.context'
import './i18n'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <SidebarProvider>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
          </SidebarProvider>
        </AppProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)
