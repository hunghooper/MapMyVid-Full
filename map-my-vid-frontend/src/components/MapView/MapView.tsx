import React, { useMemo, useRef, useEffect } from 'react'
import { GoogleMap, InfoWindow, Marker, Polyline, useLoadScript } from '@react-google-maps/api'
import { useTranslation } from 'react-i18next'
import type { DetectedLocation, Video } from '@/types/video.type'

// Kiểm tra địa điểm có tọa độ hợp lệ
const isValidLocation = (loc: DetectedLocation) => {
  return (
    loc.google_place.location?.lat !== undefined &&
    loc.google_place.location?.lng !== undefined &&
    !loc.google_place.error
  )
}

const libraries = ['places'] as any
const containerStyle = {
  width: '100%',
  height: '100%'
}

interface MapViewProps {
  selectedVideo: Video | null
  validLocations: DetectedLocation[]
  activeMarker: number | null
  onMarkerClick: (index: number) => void
  onMarkerClose: () => void
  mapRef: React.RefObject<google.maps.Map>
}

const MapView: React.FC<MapViewProps> = ({
  selectedVideo,
  validLocations,
  activeMarker,
  onMarkerClick,
  onMarkerClose,
  mapRef
}) => {
  const { t } = useTranslation()

  // Google Maps
  const apiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY'
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries
  })

  // Memoized polylines to prevent unnecessary re-renders
  const polylines = useMemo(() => {
    if (validLocations.length <= 1) return []
    
    return validLocations.map((loc, index) => {
      // Skip if this is the last location or if next location is invalid
      if (index === validLocations.length - 1) return null
      
      const nextLocation = validLocations[index + 1]
      if (!nextLocation || !isValidLocation(nextLocation)) return null

      // Ensure both locations have valid coordinates
      const currentCoords = loc.google_place.location
      const nextCoords = nextLocation.google_place.location
      
      if (!currentCoords || !nextCoords) return null

      const path = [
        {
          lat: currentCoords.lat,
          lng: currentCoords.lng
        },
        {
          lat: nextCoords.lat,
          lng: nextCoords.lng
        }
      ]

      return {
        key: `route-${selectedVideo?.id}-${index}`,
        path,
        options: {
          strokeColor: '#1f2937',
          strokeOpacity: 0.8,
          strokeWeight: 3,
          icons: window.google?.maps?.SymbolPath ? [
            {
              icon: {
                path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 4,
                strokeColor: '#1f2937',
                fillColor: '#1f2937',
                fillOpacity: 1
              },
              offset: '100%'
            }
          ] : undefined
        }
      }
    }).filter((polyline): polyline is NonNullable<typeof polyline> => polyline !== null)
  }, [validLocations, selectedVideo?.id])

  // Calculate map center
  const mapCenter = useMemo(() => {
    if (!selectedVideo || validLocations.length === 0) {
      return { lat: 16.0544, lng: 108.2207 } // Da Nang, Vietnam
    }
    const sum = validLocations.reduce(
      (acc, loc) => ({
        lat: acc.lat + loc.google_place.location.lat,
        lng: acc.lng + loc.google_place.location.lng
      }),
      { lat: 0, lng: 0 }
    )
    const count = validLocations.length
    return { lat: sum.lat / count, lng: sum.lng / count }
  }, [selectedVideo?.id, validLocations])

  // Fit bounds when video changes and map is loaded
  useEffect(() => {
    if (isLoaded && mapRef.current && selectedVideo && validLocations.length > 0) {
      // Small delay to ensure map is fully rendered
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
    } else if (isLoaded && mapRef.current && (!selectedVideo || validLocations.length === 0)) {
      mapRef.current.setCenter({ lat: 16.0544, lng: 108.2207 })
      mapRef.current.setZoom(12)
    }
  }, [isLoaded, selectedVideo?.id, validLocations])

  // Loading & Error states
  if (loadError) {
    return (
      <div className='flex h-full items-center justify-center bg-white px-4'>
        <div className='text-center'>
          <div className='mb-2 text-red-500'>⚠️</div>
          <p className='text-sm text-red-600 sm:text-base'>{t('map.loadError')}</p>
          <p className='mt-1 text-xs text-gray-500 sm:text-sm'>
            Có vẻ có lỗi khi tải Google Maps. Vui lòng kiểm tra khóa API của bạn trong file .env.
          </p>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className='flex h-full items-center justify-center bg-white px-4'>
        <div className='text-center'>
          <div className='mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 sm:mb-4 sm:h-8 sm:w-8'></div>
          <p className='text-sm text-gray-600 sm:text-base'>{t('map.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='h-64 overflow-hidden rounded-lg border border-gray-200 sm:h-80 lg:h-full'>
      {validLocations.length > 0 ? (
        <GoogleMap
          key={`${selectedVideo?.id || 'no-video'}-${validLocations.length}`}
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={12}
          onLoad={(map) => {
            mapRef.current = map
          }}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true
          }}
        >
          {/* Markers */}
          {validLocations.map((loc, idx) => (
            <Marker
              key={loc.id}
              position={{
                lat: loc.google_place.location.lat,
                lng: loc.google_place.location.lng
              }}
              onClick={() => onMarkerClick(idx)}
              label={{
                text: (idx + 1).toString(),
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              {activeMarker === idx && (
                <InfoWindow onCloseClick={onMarkerClose}>
                  <div className='max-w-xs p-2'>
                    <h3 className='mb-1 font-medium text-gray-900'>
                      {loc.google_place.name || loc.original_name}
                    </h3>
                    <p className='text-sm text-gray-600'>
                      {loc.google_place.formatted_address || loc.context}
                    </p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}

          {/* Polylines */}
          {polylines.map((polyline) => (
            <Polyline
              key={polyline.key}
              path={polyline.path}
              options={polyline.options}
            />
          ))}
        </GoogleMap>
      ) : (
        <div className='flex h-full items-center justify-center bg-gray-50'>
          <p className='text-sm text-gray-500 sm:text-base'>{t('locations.notFound')}</p>
        </div>
      )}
    </div>
  )
}

export default MapView
