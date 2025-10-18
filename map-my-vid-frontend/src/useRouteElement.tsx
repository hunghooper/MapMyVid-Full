import { useContext } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import path from './constants/path'
import { AppContext } from './contexts/app.context'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import OverviewPage from './pages/OverviewPage'
import Register from './pages/Register'

// eslint-disable-next-line react-refresh/only-export-components
function ProtectedRoutes() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
}

// eslint-disable-next-line react-refresh/only-export-components
function RejectedRoutes() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to={'/'} />
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '',
      element: <ProtectedRoutes />,
      children: [
        {
          element: <MainLayout />,
          children: [
            {
              path: path.home,
              element: <OverviewPage />
            }
          ]
        }
      ]
    },
    {
      path: '/',
      element: <RejectedRoutes />,
      children: [
        {
          path: path.login,
          element: <Login />
        },
        {
          path: path.register,
          element: <Register />
        }
      ]
    }
  ])
  return routeElements
}
