import React from 'react'
import { MapPin } from 'lucide-react'

const EmptyState: React.FC = () => {
  return (
    <div className='flex items-center justify-center p-8 text-center sm:p-12'>
      <div>
        <MapPin className='mx-auto mb-3 h-8 w-8 text-gray-400 sm:mb-4 sm:h-12 sm:w-12' />
        <p className='text-sm text-gray-500 sm:text-base'>Bạn cần chọn một video hoặc import một video mới.</p>
      </div>
    </div>
  )
}

export default EmptyState
