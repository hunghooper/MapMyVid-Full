import { Link } from 'react-router-dom'
import { useSidebar } from '../../contexts/sidebar.context'

interface SidebarItemProps {
  icon: JSX.Element
  text: string
  alert?: boolean
  path?: string
}

export default function SidebarItem({ icon, text, path = '#' }: SidebarItemProps) {
  const { isSidebarOpen } = useSidebar()

  return (
    <Link
      to={path}
      className='group flex w-full items-center justify-center rounded-lg fill-primary-500 py-2 text-base text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
    >
      {icon}
      <span
        // eslint-disable-next-line sonarjs/no-nested-template-literals
        className={`ml-3 flex-1 transform whitespace-nowrap text-left font-semibold duration-300 ${isSidebarOpen ? `` : `hidden transform`}`}
      >
        {text}
      </span>
      <svg
        // eslint-disable-next-line sonarjs/no-nested-template-literals
        className={`h-6 w-6 transition-transform duration-300 ${isSidebarOpen ? `` : `hidden transform`}`}
        viewBox='0 0 20 20'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fillRule='evenodd'
          d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
          clipRule='evenodd'
        ></path>
      </svg>
    </Link>
  )
}
