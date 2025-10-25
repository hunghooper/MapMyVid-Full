export interface LocationDto {
  name: string
  type: 'restaurant' | 'cafe' | 'hotel' | 'attraction' | 'store' | 'other'
  context: string
  address?: string
}

export interface VideoAnalysisResponseDto {
  locations: LocationDto[]
  city?: string
  country?: string
  summary?: string
}

export interface GooglePlaceDto {
  name: string
  formatted_address: string
  location: { lat: number; lng: number }
  place_id: string
  rating?: number
  types?: string[]
  google_maps_url: string
}

export interface FinalResponseDto {
  success: boolean
  video_id: string
  video_info: {
    filename: string
    size: number
    mimetype: string
    city?: string
    country?: string
  }
  locations_found: number
  locations: Array<{
    id: string
    original_name: string
    type: string
    context: string
    google_place: GooglePlaceDto | { error: string }
    isFavorite: boolean
  }>
  processing_time_ms: number
}
