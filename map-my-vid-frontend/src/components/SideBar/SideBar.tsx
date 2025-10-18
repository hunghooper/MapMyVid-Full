import clsx from 'clsx'
import { Icons } from '../../assets/Icons/Icons'
import Logo from '../../assets/LOGO.svg'
import { useSidebar } from '../../contexts/sidebar.context'
import SidebarItem from '../SideBarItem'

const Sidebar = () => {
  const { isSidebarOpen } = useSidebar()

  return (
    <aside
      className={clsx(
        'h-full border-r border-gray-200 bg-white text-white transition-all duration-300 dark:border-gray-700 dark:bg-gray-800',
        isSidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className='flex h-16 items-center justify-center text-lg font-bold'>
        <a href='https://ieltslisa.edu.vn/' className='flex items-center'>
          <img src={Logo} className='mr-3 h-10 w-full sm:h-9' alt='Lisa Logo' />
          {isSidebarOpen && (
            <span className='self-center whitespace-nowrap text-xl font-semibold text-black dark:text-white'>
              IELTS LISA
            </span>
          )}
        </a>
      </div>
      <div className='min-h-[1px] bg-gray-200' />
      <nav className='mt-4 flex flex-col space-y-2 px-4'>
        <SidebarItem text='Home' icon={<Icons.PieChartIcon />} />
        <SidebarItem
          text='Students'
          icon={
            <svg
              className='h-6 w-6 min-w-6 fill-primary-700 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                fillRule='evenodd'
                d='M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z'
                clipRule='evenodd'
              />
            </svg>
          }
        />
      </nav>
    </aside>
  )
}

export default Sidebar
