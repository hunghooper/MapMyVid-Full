import React, { useCallback, useRef } from 'react'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { DetectedLocation, Video } from '@/types/video.type'
import HeartIcon from '@/components/HeartIcon'

// Kiểm tra địa điểm có tọa độ hợp lệ
const isValidLocation = (loc: DetectedLocation) => {
  // Kiểm tra từ google_place trước (vì latitude/longitude có thể là undefined)
  if (loc.google_place?.location?.lat !== undefined && 
      loc.google_place?.location?.lng !== undefined && 
      !loc.google_place?.error) {
    return true
  }
  
  // Fallback: kiểm tra từ backend data (latitude, longitude)
  if (loc.latitude !== undefined && loc.longitude !== undefined) {
    return true
  }
  
  return false
}

interface LocationListProps {
  selectedVideo: Video | null
  validLocations: DetectedLocation[]
  mapRef: React.RefObject<google.maps.Map>
  onLocationReorder: (newLocations: DetectedLocation[]) => void
  onLocationFocus: (index: number) => void
  onLocationDelete: (locationId: string) => void
  onToggleFavorite?: (locationId: string) => void
}

const LocationList: React.FC<LocationListProps> = ({
  selectedVideo,
  validLocations,
  mapRef,
  onLocationReorder,
  onLocationFocus,
  onLocationDelete,
  onToggleFavorite
}) => {
  const { t } = useTranslation()
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)

  // Drag & Drop handlers
  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDragEnter = useCallback((_e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      if (dragItem.current === null || dragOverItem.current === null || !selectedVideo?.locations) return

      const fullLocations = selectedVideo.locations
      if (!isValidLocation(fullLocations[dragItem.current])) return

      const newFullLocations = [...fullLocations]
      const draggedItemContent = newFullLocations[dragItem.current]

      newFullLocations.splice(dragItem.current, 1)
      newFullLocations.splice(dragOverItem.current, 0, draggedItemContent)

      onLocationReorder(newFullLocations)

      dragItem.current = null
      dragOverItem.current = null
    },
    [selectedVideo, onLocationReorder]
  )

  const handleLocationClick = useCallback((loc: DetectedLocation, _idx: number) => {
    if (mapRef.current && isValidLocation(loc)) {
      mapRef.current.panTo({
        lat: loc.google_place.location.lat,
        lng: loc.google_place.location.lng
      })
      mapRef.current.setZoom(15)
      const markerIdx = validLocations.findIndex((vl) => vl.id === loc.id)
      onLocationFocus(markerIdx)
    }
  }, [mapRef, validLocations, onLocationFocus])

  const handleDeleteLocation = useCallback((e: React.MouseEvent, locationId: string) => {
    e.stopPropagation()
    onLocationDelete(locationId)
  }, [onLocationDelete])

  return (
    <div className='w-full border-t border-gray-200 p-4 lg:w-80 lg:border-l lg:border-t-0 lg:p-6'>
      <h3 className='mb-3 text-sm font-medium text-gray-900 sm:mb-4 sm:text-base'>{t('locations.reorder')}</h3>
      <div className='max-h-48 space-y-2 overflow-y-auto sm:max-h-64 lg:max-h-[500px]'>
        {selectedVideo?.locations && selectedVideo.locations.length > 0 ? (
          selectedVideo.locations.map((loc, idx) => {
            const isFound = isValidLocation(loc)
            const displayIndex = validLocations.findIndex((vl) => vl.id === loc.id) + 1

            return (
              <div
                key={loc.id}
                draggable={isFound}
                onDragStart={(e) => isFound && handleDragStart(e, idx)}
                onDragOver={handleDragOver}
                onDragEnter={(e) => isFound && handleDragEnter(e, idx)}
                onDrop={handleDrop}
                onClick={() => handleLocationClick(loc, idx)}
                className={`rounded-lg border border-gray-200 p-2 transition-colors sm:p-3 ${
                  isFound ? 'cursor-move hover:bg-gray-50' : 'cursor-default bg-gray-100 opacity-70'
                }`}
                title={isFound ? t('locations.dragToReorder') : t('locations.noCoordinates')}
              >
                <div className='flex items-start gap-2 sm:gap-3'>
                  <div
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium text-white sm:h-6 sm:w-6 ${
                      isFound ? 'bg-gray-900' : 'bg-red-500'
                    }`}
                  >
                    {isFound ? displayIndex : '✕'}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-xs font-medium text-gray-900 sm:text-sm'>{loc.original_name}</p>
                    <p
                      className={`mt-1 line-clamp-2 text-xs ${isFound ? 'text-gray-500' : 'text-red-500'}`}
                    >
                      {loc.google_place.error || loc.google_place.formatted_address || loc.context}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={(e) => handleDeleteLocation(e, loc.id)}
                      className='p-1 text-gray-400 transition-colors hover:text-red-500'
                      aria-label={t('videos.delete')}
                      title={t('videos.delete')}
                    >
                      <Trash2 className='h-3 w-3 sm:h-4 sm:w-4' />
                    </button>
                    {onToggleFavorite && (
                      <HeartIcon
                        isFilled={!!loc.isFavorite}
                        onClick={() => {
                          onToggleFavorite(loc.id)
                        }}
                        className="cursor-pointer"
                        size="sm"
                      />
                    )}
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <p className='text-sm text-gray-500'>{t('locations.noLocations')}</p>
        )}
      </div>
    </div>
  )
}

export default LocationList
