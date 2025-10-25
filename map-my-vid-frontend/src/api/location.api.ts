import http from '@/utils/http'
import path from '@/constants/path'

// Location types for API
export interface Location {
  id: string
  videoId: string
  originalName: string
  type: string
  context: string
  aiAddress: string
  googleName: string
  formattedAddress: string
  latitude: number
  longitude: number
  placeId: string
  rating: number | null
  googleMapsUrl: string
  types: string[]
  searchStatus: 'FOUND' | 'NOT_FOUND' | 'PENDING'
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateLocationRequest {
  videoId: string
  originalName: string
  type: string
  context: string
  aiAddress: string
  googleName?: string
  formattedAddress?: string
  latitude?: number
  longitude?: number
  placeId?: string
  rating?: number
  googleMapsUrl?: string
  types?: string[]
  searchStatus?: 'FOUND' | 'NOT_FOUND' | 'PENDING'
}

export interface UpdateLocationRequest {
  originalName?: string
  type?: string
  context?: string
  aiAddress?: string
  googleName?: string
  formattedAddress?: string
  latitude?: number
  longitude?: number
  placeId?: string
  rating?: number
  googleMapsUrl?: string
  types?: string[]
  searchStatus?: 'FOUND' | 'NOT_FOUND' | 'PENDING'
  isFavorite?: boolean
}

export interface LocationListResponse {
  data: Location[]
  total: number
  page: number
  pageSize: number
}

export const locationApi = {
  // POST /api/locations - Create a new location
  createLocation(data: CreateLocationRequest) {
    return http.post<Location>(path.locations, data)
  },

  // GET /api/locations - Get all locations with pagination
  getLocations(page = 1, pageSize = 20, videoId?: string, favoritesOnly = false) {
    const params: any = { page, pageSize }
    if (videoId) {
      params.videoId = videoId
    }
    if (favoritesOnly) {
      params.favoritesOnly = true
    }
    
    return http.get<LocationListResponse>(path.locations, { params })
  },

  // GET /api/locations/{id} - Get location by ID
  getLocationById(id: string) {
    return http.get<Location>(`${path.locations}/${id}`)
  },

  // PATCH /api/locations/{id} - Update location
  updateLocation(id: string, data: UpdateLocationRequest) {
    return http.patch<Location>(`${path.locations}/${id}`, data)
  },

  // DELETE /api/locations/{id} - Delete location
  deleteLocation(id: string) {
    return http.delete(`${path.locations}/${id}`)
  },

  // PATCH /api/locations/{id}/favorite - Toggle favorite status
  toggleFavorite(id: string) {
    return http.patch<Location>(`${path.locations}/${id}/favorite`)
  },

  // GET /api/locations/favorites - Get all favorite locations
  getFavoriteLocations(page = 1, pageSize = 20, videoId?: string) {
    const params: any = { page, pageSize }
    if (videoId) {
      params.videoId = videoId
    }
    return http.get<LocationListResponse>(`${path.locations}/favorites`, { params })
  },

  // PATCH /api/locations/{id}/favorite/set - Set favorite status directly
  setFavorite(id: string, isFavorite: boolean) {
    return http.patch<Location>(`${path.locations}/${id}/favorite/set`, { isFavorite })
  }
}

export default locationApi
