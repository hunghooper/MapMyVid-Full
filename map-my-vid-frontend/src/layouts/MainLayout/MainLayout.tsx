import Header from 'components/Header/Header'
import { Outlet } from 'react-router-dom'

export default function MainLayout() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <main className='mx-auto max-w-screen-xl px-6 py-2'>
        <Outlet />
      </main>
    </div>
  )
}
