import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import locationApi, { CreateLocationRequest, UpdateLocationRequest } from '@/api/location.api'

// Hook để fetch danh sách locations
export function useLocations(page = 1, pageSize = 20, videoId?: string) {
  return useQuery({
    queryKey: ['locations', page, pageSize, videoId],
    queryFn: () => locationApi.getLocations(page, pageSize, videoId)
  })
}

// Hook để fetch location by ID
export function useLocation(id: string) {
  return useQuery({
    queryKey: ['location', id],
    queryFn: () => locationApi.getLocationById(id),
    enabled: !!id
  })
}

// Hook để tạo location mới
export function useCreateLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateLocationRequest) => locationApi.createLocation(data),
    
    onSuccess: (response) => {
      // Invalidate locations queries để refetch data
      queryClient.invalidateQueries({ queryKey: ['locations'] })
      
      // Nếu có videoId, cũng invalidate video queries
      if (response.data.videoId) {
        queryClient.invalidateQueries({ queryKey: ['videos'] })
      }
    }
  })
}

// Hook để update location
export function useUpdateLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLocationRequest }) => 
      locationApi.updateLocation(id, data),
    
    onSuccess: (response, variables) => {
      // Update cache cho location cụ thể
      queryClient.setQueryData(['location', variables.id], response.data)
      
      // Invalidate locations list
      queryClient.invalidateQueries({ queryKey: ['locations'] })
      
      // Invalidate videos nếu có videoId
      if (response.data.videoId) {
        queryClient.invalidateQueries({ queryKey: ['videos'] })
      }
    }
  })
}

// Hook để delete location
export function useDeleteLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => locationApi.deleteLocation(id),
    
    onSuccess: (_, id) => {
      // Remove location từ cache
      queryClient.removeQueries({ queryKey: ['location', id] })
      
      // Invalidate locations list
      queryClient.invalidateQueries({ queryKey: ['locations'] })
      
      // Invalidate videos
      queryClient.invalidateQueries({ queryKey: ['videos'] })
    }
  })
}
