import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDeleteVideo, useUploadVideo, useVideos } from '@/hooks/useVideos'
import { useDeleteLocation, useToggleFavorite } from '@/hooks/useLocations'
import type { DetectedLocation, Video } from '@/types/video.type'
import { useTranslation } from 'react-i18next'

// Import components
import VideoUpload from '@/components/VideoUpload'
import VideoList from '@/components/VideoList'
import MapView from '@/components/MapView'
import LocationList from '@/components/LocationList'
import MapHeader from '@/components/MapHeader'
import EmptyState from '@/components/EmptyState'
import Modal from '@/components/Modal'
import { AiRoutePlanner } from '@/components/AiRoutePlanner'

// Kiểm tra địa điểm có tọa độ hợp lệ
const isValidLocation = (loc: DetectedLocation) => {
  console.log('Checking location:', loc.id, {
    latitude: loc.latitude,
    longitude: loc.longitude,
    google_place: loc.google_place,
    isFavorite: loc.isFavorite
  })
  
  // Kiểm tra từ google_place trước (vì latitude/longitude có thể là undefined)
  if (loc.google_place?.location?.lat !== undefined && 
      loc.google_place?.location?.lng !== undefined && 
      !loc.google_place?.error) {
    console.log('Valid from google_place:', loc.id)
    return true
  }
  
  // Fallback: kiểm tra từ backend data (latitude, longitude)
  if (loc.latitude !== undefined && loc.longitude !== undefined) {
    console.log('Valid from backend data:', loc.id)
    return true
  }
  
  console.log('Invalid location:', loc.id)
  return false
}

export default function MapDashboard() {
  const { t } = useTranslation()

  // Custom hooks
  const { data, isLoading: isVideosLoading } = useVideos(1, 20)
  const uploadMutation = useUploadVideo()
  const deleteMutation = useDeleteVideo()
  const deleteLocationMutation = useDeleteLocation()
  const toggleFavoriteMutation = useToggleFavorite()

  const videos = data?.videos || []
  const completedVideos = useMemo(() => videos.filter((v: Video) => v.status === 'COMPLETED'), [videos])

  // State
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(videos[0] || null)
  const [isAiRouteModalOpen, setIsAiRouteModalOpen] = useState(false)
  
  // Debug logs
  console.log('videos:', videos)
  console.log('completedVideos:', completedVideos)
  console.log('selectedVideo:', selectedVideo)
  const [activeMarker, setActiveMarker] = useState<number | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)

  // Valid locations (có tọa độ)
  const validLocations = useMemo(() => {
    if (!selectedVideo?.locations) return []
    console.log('selectedVideo.locations:', selectedVideo.locations)
    const valid = selectedVideo.locations.filter(isValidLocation)
    console.log('validLocations:', valid)
    return valid
  }, [selectedVideo?.locations])

  // Cleanup map state when video changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current = null
    }
    // Reset active marker
    setActiveMarker(null)
  }, [selectedVideo?.id])

  // Force map re-render when validLocations change (for location deletion)
  useEffect(() => {
    if (mapRef.current && validLocations.length > 0) {
      // Small delay to ensure state is updated
      const timer = setTimeout(() => {
        if (mapRef.current) {
          const bounds = new window.google.maps.LatLngBounds()
          validLocations.forEach((loc) => {
            bounds.extend({
              lat: loc.google_place.location.lat,
              lng: loc.google_place.location.lng
            })
          })
          mapRef.current.fitBounds(bounds)
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [validLocations.length])


  // Auto-select first video
  useEffect(() => {
    if (!selectedVideo && completedVideos.length > 0) {
      setSelectedVideo(completedVideos[0])
    } else if (completedVideos.length === 0) {
      setSelectedVideo(null)
    }
  }, [completedVideos, selectedVideo])

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadMutation.mutate({ file, name: file.name })
      console.log('Uploading file:', file.name)
    }
  }

  // Handle delete
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
    if (selectedVideo?.id === id) {
      setSelectedVideo(null)
    }
  }

  // Handle marker click
  const handleMarkerClick = useCallback((index: number) => {
    setActiveMarker(index)
  }, [])

  // Handle marker close
  const handleMarkerClose = useCallback(() => {
    setActiveMarker(null)
  }, [])

  // Handle location reorder
  const handleLocationReorder = useCallback((newLocations: DetectedLocation[]) => {
    if (selectedVideo) {
      setSelectedVideo({ ...selectedVideo, locations: newLocations })
    }
  }, [selectedVideo])

  // Handle location focus
  const handleLocationFocus = useCallback((index: number) => {
    setActiveMarker(index)
  }, [])

  // Handle location delete
  const handleLocationDelete = useCallback((locationId: string) => {
    deleteLocationMutation.mutate(locationId, {
      onSuccess: () => {
        // Update local state to remove the deleted location
        if (selectedVideo) {
          const updatedLocations = selectedVideo.locations.filter(loc => loc.id !== locationId)
          setSelectedVideo({ ...selectedVideo, locations: updatedLocations })
          
          // Reset active marker if it was pointing to deleted location
          const deletedLocationIndex = validLocations.findIndex(loc => loc.id === locationId)
          if (deletedLocationIndex !== -1 && activeMarker === deletedLocationIndex) {
            setActiveMarker(null)
          }
        }
      }
    })
  }, [deleteLocationMutation, selectedVideo, validLocations, activeMarker])

  // Handle toggle favorite
  const handleToggleFavorite = useCallback((locationId: string) => {
    toggleFavoriteMutation.mutate(locationId, {
      onSuccess: (response) => {
        // response.data là Location object trực tiếp từ backend
        // Cập nhật local state với data mới
        if (selectedVideo) {
          const updatedLocations = selectedVideo.locations.map(loc => 
            loc.id === locationId 
              ? { ...loc, isFavorite: response.data.isFavorite }
              : loc
          )
          setSelectedVideo({ ...selectedVideo, locations: updatedLocations })
        }
      },
      onError: (error) => {
        console.error('Failed to toggle favorite:', error)
        // Có thể thêm toast notification ở đây
      }
    })
  }, [toggleFavoriteMutation, selectedVideo])

  // Export to Google Maps
  const handleExportToGoogleMaps = () => {
    if (!selectedVideo || validLocations.length < 2) {
      console.log(t('export.noLocationsToExport'))
      return
    }

    const locations = validLocations
    const origin = locations[0].google_place.location
    const destination = locations[locations.length - 1].google_place.location

    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}`

    if (locations.length > 2) {
      const waypoints = locations
        .slice(1, locations.length - 1)
        .map((loc) => `${loc.google_place.location.lat},${loc.google_place.location.lng}`)
        .join('|')
      url += `&waypoints=${waypoints}`
    }

    window.open(url, '_blank')
  }

  return (
    <div className='min-h-screen bg-white relative'>
      <div className='mx-auto max-w-screen-xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8'>
        <div className='mb-4 sm:mb-6 lg:mb-8'>
          <h1 className='mb-2 text-xl font-medium text-gray-900 sm:text-2xl'>{t('dashboard.title')}</h1>
          <p className='text-sm text-gray-600 sm:text-base'>{t('dashboard.subtitle')}</p>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8'>
          {/* Sidebar */}
          <div className='space-y-4 sm:space-y-6 lg:col-span-1'>
            {/* Upload Section */}
            <VideoUpload
              onFileUpload={handleFileUpload}
              isUploading={uploadMutation.isPending}
              uploadError={uploadMutation.isError}
            />

            {/* Video List */}
            <VideoList
              videos={completedVideos}
              selectedVideo={selectedVideo}
              onSelectVideo={setSelectedVideo}
              onDeleteVideo={handleDelete}
            />
          </div>

          {/* Main Content */}
          <div className='lg:col-span-3'>
            <div className='overflow-hidden rounded-lg border border-gray-200'>
              {selectedVideo && selectedVideo.status === 'COMPLETED' ? (
                <div className='h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)] lg:h-[calc(100vh-12rem)]'>
                  {/* Header */}
                  <MapHeader
                    selectedVideo={selectedVideo}
                    validLocationsCount={validLocations.length}
                    onExportToGoogleMaps={handleExportToGoogleMaps}
                  />

                  {/* Content */}
                  <div className='flex h-full flex-col lg:flex-row'>
                    {/* Map */}
                    <div className='flex-1 p-2 sm:p-4 lg:p-6'>
                      <MapView
                        selectedVideo={selectedVideo}
                        validLocations={validLocations}
                        activeMarker={activeMarker}
                        onMarkerClick={handleMarkerClick}
                        onMarkerClose={handleMarkerClose}
                        mapRef={mapRef}
                      />
                    </div>

                    {/* Location List */}
                    <LocationList
                      selectedVideo={selectedVideo}
                      validLocations={validLocations}
                      mapRef={mapRef}
                      onLocationReorder={handleLocationReorder}
                      onLocationFocus={handleLocationFocus}
                      onLocationDelete={handleLocationDelete}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </div>
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Route Planner FAB */}
      <button
        onClick={() => setIsAiRouteModalOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
        title="AI Route Planner"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </button>

      {/* AI Route Planner Modal */}
      <Modal
        isOpen={isAiRouteModalOpen}
        onClose={() => setIsAiRouteModalOpen(false)}
        title="AI Route Planner"
        mode="sidebar"
        className="max-w-4xl h-full max-h-[80vh] overflow-y-auto"
      >
        <AiRoutePlanner />
      </Modal>
    </div>
  )
}