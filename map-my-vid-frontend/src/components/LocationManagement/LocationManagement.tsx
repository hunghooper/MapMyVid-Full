import React, { useState } from 'react'
import { useLocations, useCreateLocation, useUpdateLocation, useDeleteLocation } from '@/hooks/useLocations'
import { CreateLocationRequest, UpdateLocationRequest } from '@/api/location.api'

const LocationManagement: React.FC = () => {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [videoId, setVideoId] = useState<string>('')
  
  // Queries
  const { data: locationsData, isLoading, error } = useLocations(page, pageSize, videoId || undefined)
  
  // Mutations
  const createLocationMutation = useCreateLocation()
  const updateLocationMutation = useUpdateLocation()
  const deleteLocationMutation = useDeleteLocation()

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

  if (isLoading) return <div>Loading locations...</div>
  if (error) return <div>Error loading locations</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Location Management</h1>
      
      {/* Filters */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by Video ID"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          className="border rounded px-3 py-2 mr-2"
        />
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
        {locationsData?.data.map((location) => (
          <div key={location.id} className="border rounded p-4">
            <h3 className="font-semibold">{location.originalName}</h3>
            <p className="text-sm text-gray-600">{location.formattedAddress}</p>
            <p className="text-sm">Status: {location.searchStatus}</p>
            <p className="text-sm">Coordinates: {location.latitude}, {location.longitude}</p>
            
            <div className="mt-2">
              <button
                onClick={() => handleUpdateLocation(location.id)}
                disabled={updateLocationMutation.isPending}
                className="bg-green-500 text-white px-3 py-1 rounded mr-2"
              >
                Update
              </button>
              <button
                onClick={() => handleDeleteLocation(location.id)}
                disabled={deleteLocationMutation.isPending}
                className="bg-red-500 text-white px-3 py-1 rounded"
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
          disabled={!locationsData?.data.length}
          className="bg-gray-500 text-white px-3 py-1 rounded"
        >
          Next
        </button>
      </div>

      {/* Stats */}
      <div className="mt-4 text-sm text-gray-600">
        Total: {locationsData?.total || 0} locations
      </div>
    </div>
  )
}

export default LocationManagement
