import React from 'react'
import { ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Video } from '@/types/video.type'

interface MapHeaderProps {
  selectedVideo: Video | null
  validLocationsCount: number
  onExportToGoogleMaps: () => void
}

const MapHeader: React.FC<MapHeaderProps> = ({ selectedVideo, validLocationsCount, onExportToGoogleMaps }) => {
  const { t } = useTranslation()

  return (
    <div className='border-b border-gray-200 p-4 sm:p-6'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <h2 className='text-base font-medium text-gray-900 sm:text-lg'>{selectedVideo?.name}</h2>
        <button
          onClick={onExportToGoogleMaps}
          className='inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white transition-colors hover:bg-gray-800 disabled:opacity-50 sm:px-4 sm:text-sm'
          disabled={validLocationsCount < 2}
        >
          <ExternalLink className='h-3 w-3 sm:h-4 sm:w-4' />
          {t('export.toGoogleMaps')}
        </button>
      </div>
    </div>
  )
}

export default MapHeader
