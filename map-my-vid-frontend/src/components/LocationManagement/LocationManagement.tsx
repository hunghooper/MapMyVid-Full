import React, { useState, useEffect } from 'react'
import { useLocations, useCreateLocation, useUpdateLocation, useDeleteLocation, useToggleFavorite } from '@/hooks/useLocations'
import { CreateLocationRequest, UpdateLocationRequest } from '@/api/location.api'
import HeartIcon from '@/components/HeartIcon'

const LocationManagement: React.FC = () => {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [videoId, setVideoId] = useState<string>('')
  
  // Initialize showFavoritesOnly based on backend data
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  
  // Queries
  const { data: locationsData, isLoading, error } = useLocations(page, pageSize, videoId || undefined, showFavoritesOnly)
  
  // Debug logs
  console.log('videoId:', videoId)
  console.log('showFavoritesOnly:', showFavoritesOnly)
  console.log('locationsData:', locationsData)
  console.log('isLoading:', isLoading)
  console.log('error:', error)
  
  // Mutations
  const createLocationMutation = useCreateLocation()
  const updateLocationMutation = useUpdateLocation()
  const deleteLocationMutation = useDeleteLocation()
  const toggleFavoriteMutation = useToggleFavorite()

  // Update showFavoritesOnly based on backend data
  useEffect(() => {
    if (locationsData?.data?.data && locationsData.data.data.length > 0) {
      // Check if there are any favorite locations
      const hasFavorites = locationsData.data.data.some((location: any) => location.isFavorite === true)
      setShowFavoritesOnly(hasFavorites)
    } else {
      setShowFavoritesOnly(false)
    }
  }, [locationsData])

  // Reset filter when video changes
  useEffect(() => {
    setShowFavoritesOnly(false)
    setPage(1) // Also reset to first page
  }, [videoId])

  // Create location handler
  const handleCreateLocation = () => {
    const newLocation: CreateLocationRequest = {
      videoId: 'video-123',
      originalName: 'Test Location',
      type: 'landmark',
      context: 'Test context',
      aiAddress: 'Test AI Address',
      searchStatus: 'PENDING'
    }
    
    createLocationMutation.mutate(newLocation)
  }

  // Update location handler
  const handleUpdateLocation = (id: string) => {
    const updateData: UpdateLocationRequest = {
      originalName: 'Updated Location Name',
      searchStatus: 'FOUND'
    }
    
    updateLocationMutation.mutate({ id, data: updateData })
  }

  // Delete location handler
  const handleDeleteLocation = (id: string) => {
    deleteLocationMutation.mutate(id)
  }

  // Toggle favorite handler
  const handleToggleFavorite = (id: string) => {
    toggleFavoriteMutation.mutate(id, {
      onError: (error) => {
        console.error('Failed to toggle favorite:', error)
        // Có thể thêm toast notification ở đây
      }
    })
  }

  if (isLoading) return <div>Loading locations...</div>
  if (error) return <div>Error loading locations</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Location Management</h1>
      
      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Filter by Video ID"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(e) => setShowFavoritesOnly(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show favorites only</span>
        </label>
        {showFavoritesOnly && (
          <div className="flex items-center gap-1 text-sm text-yellow-600">
            <span>⭐</span>
            <span>Showing {locationsData?.data?.data?.length || 0} favorite locations</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mb-4">
        <button
          onClick={handleCreateLocation}
          disabled={createLocationMutation.isPending}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          {createLocationMutation.isPending ? 'Creating...' : 'Create Location'}
        </button>
      </div>

      {/* Locations List */}
      <div className="space-y-2">
        {locationsData?.data?.data?.map((location) => (
          <div key={location.id} className="border rounded p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{location.originalName}</h3>
                <p className="text-sm text-gray-600">{location.formattedAddress}</p>
                <p className="text-sm">Status: {location.searchStatus}</p>
                <p className="text-sm">Coordinates: {location.latitude}, {location.longitude}</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <HeartIcon
                  isFilled={!!location.isFavorite}
                  onClick={() => handleToggleFavorite(location.id)}
                  className="cursor-pointer"
                  size="sm"
                />
                {location.isFavorite && (
                  <span className="text-xs text-red-500">Favorite</span>
                )}
              </div>
            </div>
            
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => handleUpdateLocation(location.id)}
                disabled={updateLocationMutation.isPending}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
              >
                Update
              </button>
              <button
                onClick={() => handleDeleteLocation(location.id)}
                disabled={deleteLocationMutation.isPending}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-gray-500 text-white px-3 py-1 rounded mr-2"
        >
          Previous
        </button>
        <span className="mx-2">Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={!locationsData?.data?.data?.length}
          className="bg-gray-500 text-white px-3 py-1 rounded"
        >
          Next
        </button>
      </div>

      {/* Stats */}
      <div className="mt-4 text-sm text-gray-600">
        Total: {locationsData?.data?.total || 0} locations
      </div>
    </div>
  )
}

export default LocationManagement
