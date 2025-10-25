import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import locationApi, { CreateLocationRequest, UpdateLocationRequest } from '@/api/location.api'

// Hook để fetch danh sách locations
export function useLocations(page = 1, pageSize = 20, videoId?: string, favoritesOnly = false) {
  console.log('useLocations called with:', { page, pageSize, videoId, favoritesOnly })
  
  return useQuery({
    queryKey: ['locations', page, pageSize, videoId, favoritesOnly],
    queryFn: () => {
      console.log('Fetching locations with params:', { page, pageSize, videoId, favoritesOnly })
      return locationApi.getLocations(page, pageSize, videoId, favoritesOnly)
    },
    staleTime: 0, // Luôn stale để refetch khi cần
    refetchOnWindowFocus: true, // Refetch khi focus vào window
    enabled: !!videoId // Chỉ chạy query khi có videoId
  })
}

// Hook để fetch location by ID
export function useLocation(id: string) {
  return useQuery({
    queryKey: ['location', id],
    queryFn: () => locationApi.getLocationById(id),
    enabled: !!id,
    staleTime: 0, // Luôn stale để refetch khi cần
    refetchOnWindowFocus: true // Refetch khi focus vào window
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
    },
    
    onError: (error) => {
      console.error('Failed to create location:', error)
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
    },
    
    onError: (error) => {
      console.error('Failed to update location:', error)
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
    },
    
    onError: (error) => {
      console.error('Failed to delete location:', error)
    }
  })
}

// Hook để toggle favorite status
export function useToggleFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => locationApi.toggleFavorite(id),
    
    onSuccess: (response, id) => {
      // Update specific location in cache với data mới từ backend
      queryClient.setQueryData(['location', id], response.data)
      
      // Invalidate queries để refetch data mới từ backend
      queryClient.invalidateQueries({ queryKey: ['locations'] })
      queryClient.invalidateQueries({ queryKey: ['videos'] })
    },
    
    onError: (error) => {
      console.error('Failed to toggle favorite:', error)
      // Có thể thêm toast notification ở đây
    }
  })
}

// Hook để lấy danh sách favorite locations
export function useFavoriteLocations(page = 1, pageSize = 20, videoId?: string) {
  return useQuery({
    queryKey: ['locations', 'favorites', page, pageSize, videoId],
    queryFn: () => locationApi.getFavoriteLocations(page, pageSize, videoId),
    staleTime: 0, // Luôn stale để refetch khi cần
    refetchOnWindowFocus: true // Refetch khi focus vào window
  })
}

// Hook để set favorite status trực tiếp
export function useSetFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) => 
      locationApi.setFavorite(id, isFavorite),
    
    onSuccess: (response, variables) => {
      // Update specific location in cache với data mới từ backend
      queryClient.setQueryData(['location', variables.id], response.data)
      
      // Invalidate queries để refetch data mới từ backend
      queryClient.invalidateQueries({ queryKey: ['locations'] })
      queryClient.invalidateQueries({ queryKey: ['videos'] })
    },
    
    onError: (error) => {
      console.error('Failed to set favorite:', error)
    }
  })
}

// Hook để quản lý favorite state tổng thể
export function useFavoriteState() {
  const queryClient = useQueryClient()
  
  const getFavoriteCount = () => {
    const favoriteData = queryClient.getQueryData(['locations', 'favorites', 1, 20]) as any
    return favoriteData?.data?.total || 0
  }
  
  const isLocationFavorite = (locationId: string) => {
    // Check cache first
    const locationData = queryClient.getQueryData(['location', locationId]) as any
    return locationData?.isFavorite || false
  }
  
  return {
    getFavoriteCount,
    isLocationFavorite
  }
}
